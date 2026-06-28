const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const NodeCache = require('node-cache');

dotenv.config({ path: '../.env' });

const app = express();
const PORT = process.env.PORT || 5000;
const cache = new NodeCache();

app.use(cors());
app.use(express.json());

// Helper function - checks cache first, fetches if not found
async function fetchWithCache(key, url, ttlSeconds, options = {}) {
  const cached = cache.get(key);
  if (cached) {
    console.log(`Cache HIT: ${key}`);
    return cached;
  }
  console.log(`Cache MISS: ${key} - fetching from API`);
  const response = await fetch(url, options);
  const data = await response.json();
  cache.set(key, data, ttlSeconds);
  return data;
}

// Health check
app.get('/', (req, res) => {
  res.json({ 
    message: 'Server is running!',
    cachedKeys: cache.keys()
  });
});

// CoinGecko - crypto prices (cache 5 minutes)
app.get('/api/crypto', async (req, res) => {
  try {
    const data = await fetchWithCache(
      'crypto',
      'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd',
      300
    );
    res.json({ data, lastUpdated: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch crypto data' });
  }
});

// Frankfurter - FX rates (cache 1 hour)
app.get('/api/fx', async (req, res) => {
  try {
    const data = await fetchWithCache(
      'fx',
      'https://api.frankfurter.dev/v1/latest?from=USD&to=EUR,GBP,INR',
      3600
    );
    res.json({ data, lastUpdated: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch FX data' });
  }
});

// Open-Meteo - air quality (cache 1 hour)
app.get('/api/airquality', async (req, res) => {
  try {
    const data = await fetchWithCache(
      'airquality',
      'https://air-quality-api.open-meteo.com/v1/air-quality?latitude=17.385&longitude=78.4867&hourly=pm2_5,pm10&timezone=Asia%2FKolkata&forecast_days=1',
      3600
    );
    res.json({ data, lastUpdated: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch air quality data' });
  }
});

// Hacker News - top stories (cache 15 minutes)
app.get('/api/hackernews', async (req, res) => {
  try {
    const ids = await fetchWithCache(
      'hn-ids',
      'https://hacker-news.firebaseio.com/v0/topstories.json',
      900
    );
    const top5 = await Promise.all(
      ids.slice(0, 5).map(id =>
        fetchWithCache(
          `hn-${id}`,
          `https://hacker-news.firebaseio.com/v0/item/${id}.json`,
          900
        )
      )
    );
    res.json({ data: top5, lastUpdated: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch HN data' });
  }
});

// RandomUser - mock HR data (cache 24 hours)
app.get('/api/hr', async (req, res) => {
  try {
    const data = await fetchWithCache(
      'hr',
      'https://randomuser.me/api/?results=10&nat=us,in,gb',
      86400
    );
    res.json({ data, lastUpdated: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch HR data' });
  }
});

// Reddit - entrepreneur posts (cache 30 minutes)
app.get('/api/reddit', async (req, res) => {
  try {
    const data = await fetchWithCache(
      'reddit',
      'https://www.reddit.com/r/Entrepreneur/top.json?limit=10&t=day',
      1800,
      { headers: { 'User-Agent': 'ops-dashboard/1.0' } }
    );
    res.json({ data, lastUpdated: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch Reddit data' });
  }
});

// World Bank - macro data (cache 24 hours)
app.get('/api/worldbank', async (req, res) => {
  try {
    const data = await fetchWithCache(
      'worldbank',
      'https://api.worldbank.org/v2/country/IND/indicator/NY.GDP.MKTP.CD?format=json',
      86400
    );
    res.json({ data, lastUpdated: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch World Bank data' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});