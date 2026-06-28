const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config({ path: '../.env' });

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Server is running!' });
});

// CoinGecko - crypto prices
app.get('/api/crypto', async (req, res) => {
  try {
    const response = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd'
    );
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch crypto data' });
  }
});

// Frankfurter - FX rates
app.get('/api/fx', async (req, res) => {
  try {
    const response = await fetch(
      'https://api.frankfurter.dev/v1/latest?from=USD&to=EUR,GBP,INR'
    );
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch FX data' });
  }
});

// Open-Meteo - air quality
app.get('/api/airquality', async (req, res) => {
  try {
    const response = await fetch(
      'https://air-quality-api.open-meteo.com/v1/air-quality?latitude=17.385&longitude=78.4867&hourly=pm2_5,pm10&timezone=Asia%2FKolkata&forecast_days=1'
    );
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch air quality data' });
  }
});

// Hacker News - top stories
app.get('/api/hackernews', async (req, res) => {
  try {
    const response = await fetch(
      'https://hacker-news.firebaseio.com/v0/topstories.json'
    );
    const ids = await response.json();
    const top5 = await Promise.all(
      ids.slice(0, 5).map(id =>
        fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
          .then(r => r.json())
      )
    );
    res.json(top5);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch HN data' });
  }
});

// RandomUser - mock HR data
app.get('/api/hr', async (req, res) => {
  try {
    const response = await fetch(
      'https://randomuser.me/api/?results=10&nat=us,in,gb'
    );
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch HR data' });
  }
});

// Reddit - entrepreneur posts
app.get('/api/reddit', async (req, res) => {
  try {
    const response = await fetch(
      'https://www.reddit.com/r/Entrepreneur/top.json?limit=10&t=day',
      { headers: { 'User-Agent': 'ops-dashboard/1.0' } }
    );
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch Reddit data' });
  }
});

// World Bank - macro data
app.get('/api/worldbank', async (req, res) => {
  try {
    const response = await fetch(
      'https://api.worldbank.org/v2/country/IND/indicator/NY.GDP.MKTP.CD?format=json'
    );
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch World Bank data' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});