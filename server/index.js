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

async function fetchWithCache(key, url, ttlSeconds, options = {}) {
  const cached = cache.get(key);
  if (cached) {
    console.log(`Cache HIT: ${key}`);
    return cached;
  }
  console.log(`Cache MISS: ${key}`);
  const response = await fetch(url, options);
  const data = await response.json();
  cache.set(key, data, ttlSeconds);
  return data;
}

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Server is running!', cachedKeys: cache.keys() });
});

// ── LEVEL 1: PUBLIC APIs ──

app.get('/api/crypto', async (req, res) => {
  try {
    const data = await fetchWithCache('crypto',
      'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd', 300);
    res.json({ data, lastUpdated: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch crypto data' });
  }
});

app.get('/api/fx', async (req, res) => {
  try {
    const data = await fetchWithCache('fx',
      'https://api.frankfurter.dev/v1/latest?from=USD&to=EUR,GBP,INR', 3600);
    res.json({ data, lastUpdated: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch FX data' });
  }
});

app.get('/api/airquality', async (req, res) => {
  try {
    const data = await fetchWithCache('airquality',
      'https://air-quality-api.open-meteo.com/v1/air-quality?latitude=17.385&longitude=78.4867&hourly=pm2_5,pm10&timezone=Asia%2FKolkata&forecast_days=1', 3600);
    res.json({ data, lastUpdated: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch air quality data' });
  }
});

app.get('/api/hackernews', async (req, res) => {
  try {
    const ids = await fetchWithCache('hn-ids',
      'https://hacker-news.firebaseio.com/v0/topstories.json', 900);
    const top5 = await Promise.all(
      ids.slice(0, 5).map(id =>
        fetchWithCache(`hn-${id}`,
          `https://hacker-news.firebaseio.com/v0/item/${id}.json`, 900))
    );
    res.json({ data: top5, lastUpdated: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch HN data' });
  }
});

app.get('/api/hr', async (req, res) => {
  try {
    const data = await fetchWithCache('hr',
      'https://randomuser.me/api/?results=10&nat=us,in,gb', 86400);
    res.json({ data, lastUpdated: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch HR data' });
  }
});

app.get('/api/reddit', async (req, res) => {
  try {
    const data = await fetchWithCache('reddit',
      'https://www.reddit.com/r/Entrepreneur/top.json?limit=10&t=day',
      1800, { headers: { 'User-Agent': 'ops-dashboard/1.0' } });
    res.json({ data, lastUpdated: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch Reddit data' });
  }
});

app.get('/api/worldbank', async (req, res) => {
  try {
    const data = await fetchWithCache('worldbank',
      'https://api.worldbank.org/v2/country/IND/indicator/NY.GDP.MKTP.CD?format=json', 86400);
    res.json({ data, lastUpdated: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch World Bank data' });
  }
});

// ── LEVEL 2: KEY-BASED APIs ──

app.get('/api/stocks', async (req, res) => {
  try {
    const data = await fetchWithCache('stocks',
      `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=RELIANCE.BSE&apikey=${process.env.ALPHAVANTAGE_KEY}`, 3600);
    res.json({ data, lastUpdated: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stock data' });
  }
});

app.get('/api/weather', async (req, res) => {
  try {
    const data = await fetchWithCache('weather',
      `https://api.openweathermap.org/data/2.5/weather?lat=17.385&lon=78.4867&appid=${process.env.OPENWEATHER_KEY}&units=metric`, 1800);
    res.json({ data, lastUpdated: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});

app.get('/api/news', async (req, res) => {
  try {
    const data = await fetchWithCache('news',
      `https://newsapi.org/v2/top-headlines?country=in&category=business&apiKey=${process.env.NEWSAPI_KEY}`, 1800);
    res.json({ data, lastUpdated: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch news data' });
  }
});

app.get('/api/economics', async (req, res) => {
  try {
    const data = await fetchWithCache('economics',
      `https://api.stlouisfed.org/fred/series/observations?series_id=CPIAUCSL&api_key=${process.env.FRED_KEY}&file_type=json&limit=12&sort_order=desc`, 86400);
    res.json({ data, lastUpdated: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch economic data' });
  }
});

app.get('/api/aqi', async (req, res) => {
  try {
    const data = await fetchWithCache('aqi',
      `https://api.waqi.info/feed/hyderabad/?token=${process.env.AQICN_TOKEN}`, 1800);
    res.json({ data, lastUpdated: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch AQI data' });
  }
});

// Trello - SOP kanban board
 app.get('/api/sop-board', async (req, res) => {
  try {
    const data = await fetchWithCache('sop-board',
      `https://api.trello.com/1/boards/zMxQ2VIU/lists?cards=open&key=${process.env.TRELLO_KEY}&token=${process.env.TRELLO_TOKEN}`,
      900);
    res.json({ data, lastUpdated: new Date().toISOString() });
  } catch (error) {
    console.log('TRELLO ERROR:', error.message);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});