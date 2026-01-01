# VibeVerse - AI Agent Instructions

## Project Overview
VibeVerse is a mood-based movie & music recommender with a **dual architecture**:
- **Frontend**: Vanilla JS app ([script.js](script.js), [index.html](index.html)) with partial React migration in [src/](src/)
- **Backend**: Node/Express proxy ([server/index.js](server/index.js)) that forwards TMDb & YouTube API requests to prevent key exposure

## Architecture & Data Flow

### API Proxy Pattern (Critical)
**Never expose API keys in client code.** All external API calls route through `/api/*` endpoints:
- Frontend calls `/api/tmdb/*` and `/api/youtube/*`
- [server/index.js](server/index.js) forwards to TMDb/YouTube with server-side keys from `server/.env`
- Vite dev proxy (see [vite.config.js](vite.config.js#L9-L14)) forwards `/api` → `http://localhost:5000`

### Caching Strategy
Two-tier caching in [server/index.js](server/index.js#L47-L77):
1. **Redis** (production): Used if `REDIS_HOST` or `REDIS_URL` env vars present
2. **node-cache** (fallback): In-memory cache for local dev
3. Cache keys are **canonicalized** (sorted query params) to maximize hit rates

Example: TMDb discover endpoint sorts all query params before caching ([server/index.js](server/index.js#L81-L91))

### YouTube Result Enhancement
[server/index.js](server/index.js#L260-L320) implements smart filtering:
1. Post-filters results for "official", "VEVO", "Topic" keywords to improve music quality
2. Fetches video statistics (viewCount, likes) via YouTube Videos API
3. Ranks results by viewCount before returning to client

## Development Workflows

### Local Development Setup
```powershell
# Terminal 1: Start proxy server
cd server
npm install
# Create server/.env with TMDB_API_KEY, YOUTUBE_API_KEY, PORT=5174
npm run dev

# Terminal 2: Start frontend
cd ..
pnpm install
pnpm run dev  # Opens http://localhost:5173
```

### Docker Development
```powershell
# Run with Redis caching
docker-compose up --build
# Reads .env from repo root
```

### Testing
```powershell
# Health check (server must be running)
cd server
npm run test:health
```

## Project-Specific Conventions

### Mood Mapping System
[script.js](script.js#L76-L100) defines `MOOD_MAPPINGS` object:
- Maps moods (Happy, Sad, Romantic) → TMDb genre IDs
- Each mood has: `genres`, `color`, `gradient`, `quote`, `aura`, `musicKeywords`
- Example: `'Happy': { genres: [35, 10751], ... }` (Comedy + Family)

### Configuration Management
[config.js](config.js) exports all API endpoints and constants:
- **DO NOT commit API keys here** - use server-side proxy instead
- Spotify credentials present (should move to server/.env for production)
- Defines `SPOTIFY_MOOD_PLAYLISTS` mapping moods to playlist IDs

### State Management Transition
Project is mid-migration from vanilla JS to React:
- [src/app/store.js](src/app/store.js) + [src/features/feedbackSlice.js](src/features/feedbackSlice.js) = Redux setup
- Main app still in [script.js](script.js) (5900+ lines)
- [src/App.jsx](src/src/App.jsx) is minimal placeholder

**When adding features**: Check if they should go in vanilla JS (script.js) or React (src/). Follow existing patterns in script.js for now.

## Key Files Reference

| File | Purpose |
|------|---------|
| [script.js](script.js) | Main app logic, mood mappings, API calls, UI interactions |
| [config.js](config.js) | API endpoints, Spotify playlists, mood-music mappings |
| [server/index.js](server/index.js) | Express proxy with caching, rate limiting, result enhancement |
| [vite.config.js](vite.config.js) | Dev server config, proxy setup |
| [docker-compose.yml](docker-compose.yml) | Redis + proxy orchestration |

## Common Tasks

### Adding a New Mood
1. Add to `MOOD_MAPPINGS` in [script.js](script.js#L76)
2. Add to `SPOTIFY_MOOD_PLAYLISTS` in [config.js](config.js#L20)
3. Include genre IDs, color gradient, quote, aura effects

### Adding a New API Endpoint
1. Create proxy endpoint in [server/index.js](server/index.js)
2. Use `cachedFetch()` helper for automatic Redis/memory caching
3. Sort query params for consistent cache keys
4. Update frontend to call `/api/your-endpoint`

### Environment Variables
- **Development**: `server/.env` (gitignored)
- **Docker**: `.env` at repo root (for docker-compose)
- **Required**: `TMDB_API_KEY`, `YOUTUBE_API_KEY`, `PORT`
- **Optional**: `REDIS_URL` or `REDIS_HOST` for Redis caching
