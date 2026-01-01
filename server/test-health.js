const fetch = require('node-fetch');

const PORT = process.env.PORT || 5174;
const BASE = `http://localhost:${PORT}`;

async function run() {
  try {
    console.log(`Checking server health at ${BASE}/api/health`);
    const h = await fetch(`${BASE}/api/health`);
    const hj = await h.text();
    console.log('Health response:', hj);

    // Try a lightweight discover call (will require TMDB key to actually succeed)
    console.log(`Attempting TMDB discover proxy (may fail without TMDB_API_KEY): ${BASE}/api/tmdb/discover`);
    const d = await fetch(`${BASE}/api/tmdb/discover?with_genres=28&page=1&sort_by=popularity.desc`);
    console.log('TMDB discover status:', d.status);
    try {
      const dj = await d.json();
      console.log('TMDB discover keys:', Object.keys(dj || {}));
    } catch (e) {
      console.log('TMDB discover parse failed (likely no key or network issue)');
    }

    console.log('Health test completed.');
    process.exit(0);
  } catch (err) {
    console.error('Health test failed:', err);
    process.exit(2);
  }
}

run();
