const express = require('express');
const fetch = require('node-fetch');
const rateLimit = require('express-rate-limit');
const NodeCache = require('node-cache');
require('dotenv').config();

const app = express();
const cache = new NodeCache({ stdTTL: 60 * 60 }); // 1 hour default cache
// Optional Redis client (used when REDIS_URL or REDIS_HOST provided)
let redisClient = null;
try {
  const REDIS_URL = process.env.REDIS_URL || null;
  const REDIS_HOST = process.env.REDIS_HOST || null;
  if (REDIS_URL || REDIS_HOST) {
    const IORedis = require('ioredis');
    if (REDIS_URL) {
      redisClient = new IORedis(REDIS_URL);
    } else {
      redisClient = new IORedis({ host: REDIS_HOST, port: process.env.REDIS_PORT || 6379 });
    }
    redisClient.on('error', (e) => console.warn('Redis error', e));
    console.log('Using Redis cache for proxy (host:', REDIS_HOST || REDIS_URL, ')');
  }
} catch (err) {
  console.warn('Redis not configured or failed to initialize:', err && err.message);
}
const PORT = process.env.PORT || 5000;

// Enable CORS when the frontend is served from a different origin (dev mode)
try {
  const cors = require('cors');
  app.use(cors());
} catch (e) {
  console.warn('cors package not installed; if you run the proxy on a separate port, enable CORS or run the frontend through a dev proxy.');
}

// Basic rate limiter to protect APIs
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 80
});
app.use(limiter);
app.use(express.json());
app.use(express.static('public'));

// Helper: cached fetch
async function cachedFetch(key, url, options = {}, ttl = 3600) {
  // Try Redis first (if available)
  if (redisClient) {
    try {
      const raw = await redisClient.get(key);
      if (raw) {
        try { return JSON.parse(raw); } catch (e) { return raw; }
      }
    } catch (err) {
      console.warn('Redis GET failed for', key, err && err.message);
    }
  }

  // Fallback to in-memory cache
  const cached = cache.get(key);
  if (cached) return cached;

  const res = await fetch(url, options);
  const data = await res.json();

  // Store in Redis if available
  if (redisClient) {
    try {
      await redisClient.set(key, JSON.stringify(data), 'EX', Math.max(60, ttl));
    } catch (err) {
      console.warn('Redis SET failed for', key, err && err.message);
    }
  }

  // Also store in in-memory cache for quick local hits
  cache.set(key, data, ttl);
  return data;
}

// TMDB discover proxy
app.get('/api/tmdb/discover', async (req, res) => {
  try {
    // Canonicalize query string (sort keys) so cache keys are stable
    const incoming = Object.assign({}, req.query || {});
    incoming.api_key = process.env.TMDB_API_KEY;
    const sortedKeys = Object.keys(incoming).sort();
    const qs = new URLSearchParams();
    for (const k of sortedKeys) qs.append(k, incoming[k]);
    // forward request to TMDB discover endpoint
    const url = `https://api.themoviedb.org/3/discover/movie?${qs.toString()}`;
    const cacheKey = `tmdb:discover:${qs.toString()}`; // canonicalized
    const data = await cachedFetch(cacheKey, url, {}, 60 * 30); // 30min cache
    res.json(data);
  } catch (err) {
    console.error('TMDB discover error', err);
    res.status(500).json({ error: 'tmdb_error' });
  }
});

// TMDB movie details / videos / providers
app.get('/api/tmdb/movie/:id/:sub?', async (req, res) => {
  try {
    const { id, sub } = req.params;
    const path = sub ? `/${sub}` : '';
    const url = `https://api.themoviedb.org/3/movie/${id}${path}?api_key=${process.env.TMDB_API_KEY}`;
    const cacheKey = `tmdb:movie:${id}:${sub || 'detail'}`;
    const data = await cachedFetch(cacheKey, url, {}, 60 * 60);
    res.json(data);
  } catch (err) {
    console.error('TMDB movie error', err);
    res.status(500).json({ error: 'tmdb_error' });
  }
});

// TMDB aggregate discover: fetch multiple pages server-side and deduplicate
app.get('/api/tmdb/aggregate-discover', async (req, res) => {
  try {
    const pages = Math.min(parseInt(req.query.pages || '10', 10), 20); // cap at 20 pages
    const perPage = 20; // TMDB returns up to 20 per page
    const queryParams = Object.assign({}, req.query || {});
    delete queryParams.pages;

    const combined = [];
    const seen = new Set();

    for (let p = 1; p <= pages; p++) {
      const params = Object.assign({}, queryParams, { page: p, api_key: process.env.TMDB_API_KEY });
      const qs = new URLSearchParams();
      Object.keys(params).sort().forEach(k => qs.append(k, params[k]));
      const url = `https://api.themoviedb.org/3/discover/movie?${qs.toString()}`;
      const cacheKey = `tmdb:discover:${qs.toString()}`;
      try {
        const data = await cachedFetch(cacheKey, url, {}, 60 * 30);
        if (data && Array.isArray(data.results)) {
          for (const m of data.results) {
            if (!m || !m.id) continue;
            if (seen.has(m.id)) continue;
            seen.add(m.id);
            combined.push(m);
            // stop early if we've gathered a good amount
            if (combined.length >= perPage * pages) break;
          }
        }
      } catch (e) {
        console.warn('aggregate-discover fetch failed for page', p, e && e.message);
      }
    }

    res.json({ results: combined, count: combined.length });
  } catch (err) {
    console.error('TMDB aggregate-discover error', err);
    res.status(500).json({ error: 'tmdb_aggregate_error' });
  }
});

// TMDB TV series discover proxy
app.get('/api/tmdb/discover-tv', async (req, res) => {
  try {
    const incoming = Object.assign({}, req.query || {});
    incoming.api_key = process.env.TMDB_API_KEY;
    const sortedKeys = Object.keys(incoming).sort();
    const qs = new URLSearchParams();
    for (const k of sortedKeys) qs.append(k, incoming[k]);
    const url = `https://api.themoviedb.org/3/discover/tv?${qs.toString()}`;
    const cacheKey = `tmdb:discover-tv:${qs.toString()}`;
    const data = await cachedFetch(cacheKey, url, {}, 60 * 30);
    res.json(data);
  } catch (err) {
    console.error('TMDB discover-tv error', err);
    res.status(500).json({ error: 'tmdb_tv_error' });
  }
});

// TMDB TV series details / videos / providers
app.get('/api/tmdb/tv/:id/:sub?', async (req, res) => {
  try {
    const { id, sub } = req.params;
    const path = sub ? `/${sub}` : '';
    const url = `https://api.themoviedb.org/3/tv/${id}${path}?api_key=${process.env.TMDB_API_KEY}`;
    const cacheKey = `tmdb:tv:${id}:${sub || 'detail'}`;
    const data = await cachedFetch(cacheKey, url, {}, 60 * 60);
    res.json(data);
  } catch (err) {
    console.error('TMDB tv error', err);
    res.status(500).json({ error: 'tmdb_tv_error' });
  }
});

// TMDB movie watch providers (specific endpoint)
app.get('/api/tmdb/movie/:id/watch/providers', async (req, res) => {
  try {
    const { id } = req.params;
    const url = `https://api.themoviedb.org/3/movie/${id}/watch/providers?api_key=${process.env.TMDB_API_KEY}`;
    const cacheKey = `tmdb:movie:${id}:watch-providers`;
    const data = await cachedFetch(cacheKey, url, {}, 60 * 60 * 24); // cache 24 hours
    res.json(data);
  } catch (err) {
    console.error('TMDB movie watch/providers error', err);
    res.status(500).json({ error: 'tmdb_providers_error' });
  }
});

// TMDB TV watch providers (specific endpoint)
app.get('/api/tmdb/tv/:id/watch/providers', async (req, res) => {
  try {
    const { id } = req.params;
    const url = `https://api.themoviedb.org/3/tv/${id}/watch/providers?api_key=${process.env.TMDB_API_KEY}`;
    const cacheKey = `tmdb:tv:${id}:watch-providers`;
    const data = await cachedFetch(cacheKey, url, {}, 60 * 60 * 24); // cache 24 hours
    res.json(data);
  } catch (err) {
    console.error('TMDB tv watch/providers error', err);
    res.status(500).json({ error: 'tmdb_providers_error' });
  }
});

// TMDB aggregate discover TV: fetch multiple pages and deduplicate
app.get('/api/tmdb/aggregate-discover-tv', async (req, res) => {
  try {
    const pages = Math.min(parseInt(req.query.pages || '10', 10), 20);
    const perPage = 20;
    const queryParams = Object.assign({}, req.query || {});
    delete queryParams.pages;

    const combined = [];
    const seen = new Set();

    for (let p = 1; p <= pages; p++) {
      const params = Object.assign({}, queryParams, { page: p, api_key: process.env.TMDB_API_KEY });
      const qs = new URLSearchParams();
      Object.keys(params).sort().forEach(k => qs.append(k, params[k]));
      const url = `https://api.themoviedb.org/3/discover/tv?${qs.toString()}`;
      const cacheKey = `tmdb:discover-tv:${qs.toString()}`;
      try {
        const data = await cachedFetch(cacheKey, url, {}, 60 * 30);
        if (data && Array.isArray(data.results)) {
          for (const show of data.results) {
            if (!show || !show.id) continue;
            if (seen.has(show.id)) continue;
            seen.add(show.id);
            combined.push(show);
            if (combined.length >= perPage * pages) break;
          }
        }
      } catch (e) {
        console.warn('aggregate-discover-tv fetch failed for page', p, e && e.message);
      }
    }

    res.json({ results: combined, count: combined.length });
  } catch (err) {
    console.error('TMDB aggregate-discover-tv error', err);
    res.status(500).json({ error: 'tmdb_tv_aggregate_error' });
  }
});

// YouTube search proxy (server uses server key)
app.get('/api/youtube/search', async (req, res) => {
  try {
    // Preserve and forward arbitrary YouTube query params from client.
    // Defaults: part=snippet, type=video, maxResults=25
    const incoming = Object.assign({}, req.query || {});
    if (!incoming.part) incoming.part = 'snippet';
    if (!incoming.type) incoming.type = 'video';
    if (!incoming.maxResults) incoming.maxResults = '25';
    // Build canonical QS for cache key
    incoming.key = process.env.YOUTUBE_API_KEY;
    const sorted = Object.keys(incoming).sort();
    const qs = new URLSearchParams();
    for (const k of sorted) qs.append(k, incoming[k]);
    const url = `https://www.googleapis.com/youtube/v3/search?${qs.toString()}`;
    const cacheKey = `yt:search:${sorted.map(k => `${k}=${incoming[k]}`).join('&')}`;
    const data = await cachedFetch(cacheKey, url, {}, 60 * 60); // cache 1 hour

    // Post-filter: prefer 'official' / VEVO / Topic / audio results to improve music accuracy
    if (data && Array.isArray(data.items) && data.items.length > 0) {
      const officialTerms = [/official/i, /vevo/i, /topic/i, /audio/i, /lyrics?/i, /music video/i];
      const filtered = data.items.filter(item => {
        try {
          const title = item.snippet?.title || '';
          const channel = item.snippet?.channelTitle || '';
          if (officialTerms.some(re => re.test(title))) return true;
          if (officialTerms.some(re => re.test(channel))) return true;
          return false;
        } catch (e) {
          return false;
        }
      });

      // If filtered results exist, prefer them; otherwise keep original items
      const chosen = filtered.length > 0 ? filtered : data.items;

      // Rank chosen results by viewCount using YouTube Videos API (fetch statistics)
      const videoIds = chosen.map(i => (i.id && (i.id.videoId || i.id)) ).filter(Boolean).slice(0, 50);
      if (videoIds.length > 0) {
        const videosQs = new URLSearchParams({
          part: 'snippet,statistics,contentDetails',
          id: videoIds.join(','),
          key: process.env.YOUTUBE_API_KEY
        });
        const videosUrl = `https://www.googleapis.com/youtube/v3/videos?${videosQs.toString()}`;
        const videosCacheKey = `yt:videos:${videoIds.join(',')}`;
        try {
          const videosData = await cachedFetch(videosCacheKey, videosUrl, {}, 60 * 60);
          if (videosData && Array.isArray(videosData.items)) {
            // Map stats by videoId
            const statsMap = {};
            for (const v of videosData.items) {
              const id = v.id;
              statsMap[id] = {
                viewCount: Number(v.statistics?.viewCount || 0),
                likeCount: Number(v.statistics?.likeCount || 0),
                duration: v.contentDetails?.duration || null,
                snippet: v.snippet || {}
              };
            }

            // Attach stats to chosen results
            const enriched = chosen.map(item => {
              const id = item.id && (item.id.videoId || item.id);
              return Object.assign({}, item, { _yt_stats: statsMap[id] || {} });
            });

            // Sort by viewCount desc then keep original order as tie-breaker
            enriched.sort((a, b) => (b._yt_stats?.viewCount || 0) - (a._yt_stats?.viewCount || 0));

            data._proxied_ranked = true;
            data._proxied_total = enriched.length;
            data.items = enriched;
          } else {
            // If videosData missing, fall back to chosen
            data.items = chosen;
          }
        } catch (e) {
          console.warn('YouTube videos fetch failed, returning chosen search items', e && e.message);
          data.items = chosen;
        }
      } else {
        data.items = chosen;
      }
    }

    res.json(data);
  } catch (err) {
    console.error('YouTube proxy error', err);
    res.status(500).json({ error: 'youtube_error' });
  }
});

// YouTube aggregate search: run multiple strategies and aggregate unique videos up to limit
app.get('/api/youtube/aggregate-search', async (req, res) => {
  try {
    const q = req.query.q || '';
    const limit = Math.min(parseInt(req.query.limit || '50', 10), 50); // cap at 50 aggregated results
    // strategies param optional (comma-separated). If not provided, use defaults tuned for music.
    let strategies = [];
    if (req.query.strategies) {
      strategies = String(req.query.strategies).split(',').map(s => s.trim()).filter(Boolean);
    } else {
      strategies = [
        `${q} official audio VEVO topic`,
        `${q} official music video`,
        `${q} official lyric video`,
        `${q} official`,
        `${q}`
      ];
    }

    const collected = [];
    const seen = new Set();

    for (const strategy of strategies) {
      if (collected.length >= limit) break;
      const params = Object.assign({}, req.query || {});
      params.q = strategy;
      params.part = params.part || 'snippet';
      params.type = params.type || 'video';
      params.maxResults = Math.min(parseInt(params.maxResults || '50', 10), 50);
      params.key = process.env.YOUTUBE_API_KEY;

      const sorted = Object.keys(params).sort();
      const qs = new URLSearchParams();
      for (const k of sorted) qs.append(k, params[k]);
      const url = `https://www.googleapis.com/youtube/v3/search?${qs.toString()}`;
      const cacheKey = `yt:search:${sorted.map(k => `${k}=${params[k]}`).join('&')}`;

      try {
        const data = await cachedFetch(cacheKey, url, {}, 60 * 60);
        if (data && Array.isArray(data.items)) {
          for (const item of data.items) {
            const vid = item.id && (item.id.videoId || item.id);
            if (!vid) continue;
            if (seen.has(vid)) continue;
            seen.add(vid);
            collected.push(item);
            if (collected.length >= limit) break;
          }
        }
      } catch (e) {
        console.warn('aggregate-search strategy failed', strategy, e && e.message);
      }
    }

    // Fetch video stats for collected ids to rank by viewCount
    const videoIds = collected.map(i => (i.id && (i.id.videoId || i.id))).filter(Boolean).slice(0, 50);
    if (videoIds.length > 0) {
      const videosQs = new URLSearchParams({ part: 'snippet,statistics,contentDetails', id: videoIds.join(','), key: process.env.YOUTUBE_API_KEY });
      const videosUrl = `https://www.googleapis.com/youtube/v3/videos?${videosQs.toString()}`;
      const videosCacheKey = `yt:videos:${videoIds.join(',')}`;
      try {
        const videosData = await cachedFetch(videosCacheKey, videosUrl, {}, 60 * 60);
        const statsMap = {};
        if (videosData && Array.isArray(videosData.items)) {
          for (const v of videosData.items) {
            statsMap[v.id] = { viewCount: Number(v.statistics?.viewCount || 0), likeCount: Number(v.statistics?.likeCount || 0) };
          }
        }
        // Attach stats and sort
        const enriched = collected.map(item => {
          const id = item.id && (item.id.videoId || item.id);
          return Object.assign({}, item, { _yt_stats: statsMap[id] || {} });
        });
        enriched.sort((a, b) => (b._yt_stats?.viewCount || 0) - (a._yt_stats?.viewCount || 0));
        res.json({ items: enriched.slice(0, limit), total: enriched.length });
        return;
      } catch (e) {
        console.warn('aggregate-search: /videos lookup failed', e && e.message);
      }
    }

    res.json({ items: collected.slice(0, limit), total: collected.length });
  } catch (err) {
    console.error('YouTube aggregate-search error', err);
    res.status(500).json({ error: 'youtube_aggregate_error' });
  }
});

// iTunes Search API - No authentication needed, unlimited searches
app.get('/api/itunes/search', async (req, res) => {
  try {
    const query = req.query.q || req.query.term || '';
    const limit = Math.min(parseInt(req.query.limit || '25', 10), 200);
    const params = new URLSearchParams({
      term: query,
      media: 'music',
      entity: 'song',
      limit: limit
    });
    const url = `https://itunes.apple.com/search?${params.toString()}`;
    const cacheKey = `itunes:search:${params.toString()}`;
    const data = await cachedFetch(cacheKey, url, {}, 60 * 60);
    res.json(data);
  } catch (err) {
    console.error('iTunes API error', err);
    res.status(500).json({ error: 'itunes_error' });
  }
});

// Deezer API - No authentication needed for search
app.get('/api/deezer/search', async (req, res) => {
  try {
    const query = req.query.q || '';
    const limit = Math.min(parseInt(req.query.limit || '25', 10), 100);
    const url = `https://api.deezer.com/search?q=${encodeURIComponent(query)}&limit=${limit}`;
    const cacheKey = `deezer:search:${query}:${limit}`;
    const data = await cachedFetch(cacheKey, url, {}, 60 * 60);
    res.json(data);
  } catch (err) {
    console.error('Deezer API error', err);
    res.status(500).json({ error: 'deezer_error' });
  }
});

// Unified music search with fallbacks: YouTube -> iTunes -> Deezer
app.get('/api/music/search', async (req, res) => {
  try {
    const query = req.query.q || '';
    const limit = Math.min(parseInt(req.query.limit || '25', 10), 50);
    
    // Try YouTube first
    try {
      const ytParams = new URLSearchParams({
        q: `${query} official audio`,
        part: 'snippet',
        type: 'video',
        maxResults: limit,
        key: process.env.YOUTUBE_API_KEY
      });
      const ytUrl = `https://www.googleapis.com/youtube/v3/search?${ytParams.toString()}`;
      const cacheKey = `yt:music:${query}:${limit}`;
      const data = await cachedFetch(cacheKey, ytUrl, {}, 60 * 60);
      
      if (data && data.items && data.items.length > 0) {
        return res.json({ source: 'youtube', ...data });
      }
    } catch (ytErr) {
      console.warn('YouTube search failed, trying fallback:', ytErr.message);
    }
    
    // Fallback to iTunes (unlimited)
    try {
      const itunesUrl = `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&media=music&entity=song&limit=${limit}`;
      const cacheKey = `itunes:music:${query}:${limit}`;
      const data = await cachedFetch(cacheKey, itunesUrl, {}, 60 * 60);
      
      if (data && data.results && data.results.length > 0) {
        // Convert iTunes format to YouTube-like format for compatibility
        const items = data.results.map(track => ({
          id: { videoId: track.trackId },
          snippet: {
            title: `${track.trackName} - ${track.artistName}`,
            description: `${track.collectionName || ''}\n${track.primaryGenreName || ''}`,
            thumbnails: {
              default: { url: track.artworkUrl60 },
              medium: { url: track.artworkUrl100 },
              high: { url: track.artworkUrl100 }
            }
          },
          _itunes: {
            previewUrl: track.previewUrl,
            trackViewUrl: track.trackViewUrl
          }
        }));
        return res.json({ source: 'itunes', items });
      }
    } catch (itunesErr) {
      console.warn('iTunes search failed, trying Deezer:', itunesErr.message);
    }
    
    // Final fallback to Deezer
    const deezerUrl = `https://api.deezer.com/search?q=${encodeURIComponent(query)}&limit=${limit}`;
    const cacheKey = `deezer:music:${query}:${limit}`;
    const data = await cachedFetch(cacheKey, deezerUrl, {}, 60 * 60);
    
    if (data && data.data) {
      // Convert Deezer format to YouTube-like format
      const items = data.data.map(track => ({
        id: { videoId: track.id },
        snippet: {
          title: `${track.title} - ${track.artist.name}`,
          description: `${track.album.title || ''}\nDuration: ${Math.floor(track.duration / 60)}:${(track.duration % 60).toString().padStart(2, '0')}`,
          thumbnails: {
            default: { url: track.album.cover_small },
            medium: { url: track.album.cover_medium },
            high: { url: track.album.cover_big }
          }
        },
        _deezer: {
          previewUrl: track.preview,
          link: track.link
        }
      }));
      return res.json({ source: 'deezer', items });
    }
    
    res.json({ source: 'none', items: [], error: 'All music APIs failed' });
  } catch (err) {
    console.error('Unified music search error', err);
    res.status(500).json({ error: 'music_search_error' });
  }
});

// Health
app.get('/api/health', (req, res) => res.json({ ok: true }));

app.listen(PORT, () => console.log(`Proxy server listening on ${PORT}`));
