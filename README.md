# VibeVerse

VibeVerse is a mood-based movie & music recommender web app. This repo contains the static frontend and a small Node/Express proxy server that securely forwards requests to third-party APIs (TMDb & YouTube) so API keys are never exposed to the browser. The proxy includes simple caching and rate limiting to reduce quota exhaustion.

## What's included
- `index.html`, `script.js`, `config.js` — frontend app
- `server/` — Node Express proxy (TMDb & YouTube endpoints, caching)

## Quick start (development)

1. Copy server environment variables (do NOT commit):

   Create `server/.env` with the following values:

   ```text
   TMDB_API_KEY=your_tmdb_api_key_here
   YOUTUBE_API_KEY=your_youtube_api_key_here
   PORT=5174
   ```

2. Start the proxy server

   Open a terminal and run:

   ```powershell
   cd "C:\Users\Dhruva Sai\Desktop\SEM 3\VibeVerse\server"
   npm install
   npm run dev
   ```

3. Start the frontend dev server (Vite)

   In a separate terminal:

   ```powershell
   cd "C:\Users\Dhruva Sai\Desktop\SEM 3\VibeVerse"
   pnpm install    # or npm install
   pnpm run dev
   ```

4. Open the frontend URL printed by Vite (usually `http://localhost:5173`) and try searches. The frontend calls the proxy at `/api/tmdb` and `/api/youtube`.

## Quick smoke test for the proxy

From the `server/` folder you can run a small health check (the server must be running):

```powershell
npm run test:health
```

This will attempt to hit `/api/health` on the configured port and report the result.

Notes on improved accuracy
- TMDb discover: the proxy canonicalizes query parameters before caching so similar queries hit the same cache key (higher cache hit-rate, fewer API calls).
- YouTube proxy: the server now forwards arbitrary YouTube query params (part/type/videoCategoryId/maxResults) and post-filters results to prefer uploads that indicate "official", "VEVO", "Topic", "audio" or "music video" — this improves music recommendation relevance and reduces noisy user-generated clips.
 - YouTube ranking: after searching, the proxy fetches video statistics (viewCount, likes, duration) for the top results and ranks items by viewCount. This improves relevance by surfacing popular official uploads first. All video-stat calls are cached to limit quota usage.

## Docker (proxy)

Build and run the proxy with Docker:

```powershell
cd server
docker build -t vibeverse-proxy .
docker run -e TMDB_API_KEY="<key>" -e YOUTUBE_API_KEY="<key>" -p 5174:5174 vibeverse-proxy
```

### Docker Compose (proxy + Redis)

For a production-like local environment with Redis caching, you can use Docker Compose. Create a `.env` file at the repo root with your keys:

```text
TMDB_API_KEY=your_tmdb_api_key_here
YOUTUBE_API_KEY=your_youtube_api_key_here
```

Then run:

```powershell
docker-compose up --build
```

This will start a Redis container and the proxy service. The proxy will connect to Redis for caching if `REDIS_HOST` is present (set by the compose file).

## Deployment notes

- The proxy is stateless but uses in-memory caching. For production with multiple instances, replace the in-memory cache with Redis or Memcached.
- Provide `TMDB_API_KEY` and `YOUTUBE_API_KEY` as environment variables at your hosting provider (Render, Heroku, etc.).
- Recommended simple deployment flow:
  - Host the static frontend on Vercel/Netlify (or serve from the same Node host).
  - Host the proxy on Render / Heroku / DigitalOcean App Platform. Use HTTPS and set environment variables in the service's dashboard.

### Platform specific hints
- Render: Create a Web Service from repo `server/` with start command `node index.js` and add environment variables in the service settings.
- Vercel / Netlify: Deploy only the frontend directory (root). Configure a environment variable or a proxy rewrites if you want to route `/api/*` to your server host.

## Security

- Never commit real API keys. `.env` is in `.gitignore` (do not add it to VCS).
- The proxy reduces key exposure and rate-limits requests, but API quotas still apply — consider caching longer TTLs for popular queries.

## Next steps you can ask me to do

- Replace in-memory cache with Redis for production multi-instance deployments.
- Add CI workflow for building & deploying frontend and proxy.
- Add integrated Docker Compose to run frontend + proxy locally.

---
Made for quick local development and safe publishing. If you want, I can add a Docker Compose and CI workflow next.
