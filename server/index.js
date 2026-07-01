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
// Clockify - time entries / workspace info
app.get('/api/clockify', async (req, res) => {
  try {
    const workspaces = await fetchWithCache('clockify-workspaces',
      'https://api.clockify.me/api/v1/workspaces',
      3600,
      { headers: { 'X-Api-Key': process.env.CLOCKIFY_KEY } }
    );
    res.json({ data: workspaces, lastUpdated: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch Clockify data' });
  }
});
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
app.get('/api/usajobs', async (req, res) => {
  try {
    const fullData = await fetchWithCache('usajobs-full',
      'https://data.usajobs.gov/api/Search?Keyword=data%20analyst&ResultsPerPage=5',
      3600,
      {
        headers: {
          'Host': 'data.usajobs.gov',
          'User-Agent': 'sunithasonu744@gmail.com',
          'Authorization-Key': process.env.USAJOBS_KEY
        }
      }
    );
    const items = fullData?.SearchResult?.SearchResultItems || [];
    const trimmed = items.map(item => ({
      title: item.MatchedObjectDescriptor?.PositionTitle,
      org: item.MatchedObjectDescriptor?.OrganizationName,
      location: item.MatchedObjectDescriptor?.PositionLocationDisplay,
      salaryMin: item.MatchedObjectDescriptor?.PositionRemuneration?.[0]?.MinimumRange,
      salaryMax: item.MatchedObjectDescriptor?.PositionRemuneration?.[0]?.MaximumRange,
      url: item.MatchedObjectDescriptor?.PositionURI
    }));
    res.json({ data: trimmed, lastUpdated: new Date().toISOString(), debugRaw: items.length === 0 ? fullData : undefined });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}); 
// SEC EDGAR - company filings (trimmed to last 5)
app.get('/api/sec-edgar', async (req, res) => {
  try {
    const fullData = await fetchWithCache('sec-edgar-full',
      'https://data.sec.gov/submissions/CIK0000320193.json',
      86400,
      { headers: { 'User-Agent': 'ops-dashboard sunithasonu744@gmail.com' } }
    );
    const recent = fullData?.filings?.recent;
    const trimmed = recent ? recent.form.slice(0, 5).map((form, i) => ({
      form,
      filingDate: recent.filingDate[i],
      accessionNumber: recent.accessionNumber[i]
    })) : [];
    res.json({
      data: { companyName: fullData?.name, filings: trimmed },
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch SEC EDGAR data' });
  }
});
 // HN Who is Hiring - latest thread comments
app.get('/api/hn-hiring', async (req, res) => {
  try {
    const searchData = await fetchWithCache('hn-hiring-search',
      'https://hn.algolia.com/api/v1/search_by_date?query=Who%20is%20hiring&tags=story&hitsPerPage=1',
      86400);
    const threadId = searchData?.hits?.[0]?.objectID;
    if (!threadId) return res.json({ data: [], lastUpdated: new Date().toISOString() });

    const threadData = await fetchWithCache(`hn-hiring-${threadId}`,
      `https://hn.algolia.com/api/v1/items/${threadId}`,
      86400);
    const topComments = (threadData?.children || []).slice(0, 5);
    res.json({ data: topComments, lastUpdated: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch HN hiring data' });
  }
});
// SOP Action Queue - in-memory store
let actionQueue = [];

function createActionIfNotExists(triggerId, sopId, assignee, reason, slaHours) {
  const exists = actionQueue.find(item => item.triggerId === triggerId && !item.resolved);
  if (exists) return exists;
  const action = {
    id: `${triggerId}-${Date.now()}`,
    triggerId,
    sopId,
    assignee,
    reason,
    createdAt: new Date().toISOString(),
    slaDeadline: new Date(Date.now() + slaHours * 60 * 60 * 1000).toISOString(),
    resolved: false
  };
  actionQueue.push(action);
  console.log('SOP TRIGGER FIRED:', action);
  return action;
}

// Check AQI and fire trigger if needed
app.get('/api/check-triggers', async (req, res) => {
  try {
    const aqiData = await fetchWithCache('aqi',
      `https://api.waqi.info/feed/hyderabad/?token=${process.env.AQICN_TOKEN}`, 1800);
    const currentAqi = aqiData?.data?.aqi || 0;

    const AQI_THRESHOLD = 80; // lowered for demo — brief specifies 200 in production

    if (currentAqi > AQI_THRESHOLD) {
      createActionIfNotExists(
        'aqi-hyderabad',
        'WFH-Advisory',
        'ops-team@company.com',
        `AQI is ${currentAqi}, exceeds threshold of ${AQI_THRESHOLD}`,
        24
      );
    }

    res.json({ currentAqi, threshold: AQI_THRESHOLD, actionQueue });
  } catch (error) {
    res.status(500).json({ error: 'Failed to check triggers' });
  }
});

// View the action queue
app.get('/api/action-queue', (req, res) => {
  res.json({ data: actionQueue, lastUpdated: new Date().toISOString() });
});
// RemoteOK - remote jobs
app.get('/api/remoteok', async (req, res) => {
  try {
    const data = await fetchWithCache('remoteok',
      'https://remoteok.com/api',
      3600,
      { headers: { 'User-Agent': 'ops-dashboard/1.0 (sunithasonu744@gmail.com)' } }
    );
    // First element is a legal notice, skip it
    const jobs = Array.isArray(data) ? data.slice(1, 6) : [];
    res.json({ data: jobs, lastUpdated: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch RemoteOK data' });
  }
});
// WHO GHO - health indicators
app.get('/api/who', async (req, res) => {
  try {
    const data = await fetchWithCache('who',
      'https://ghoapi.azureedge.net/api/NCDMORT3070?$top=10',
      86400);
    res.json({ data, lastUpdated: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch WHO data' });
  }
});

// Wikipedia - company infobox
app.get('/api/wikipedia', async (req, res) => {
  try {
    const data = await fetchWithCache('wikipedia',
      'https://en.wikipedia.org/api/rest_v1/page/summary/Infosys',
      86400,
      { headers: { 'User-Agent': 'ops-dashboard/1.0 (sunithasonu744@gmail.com)' } }
    );
    res.json({ data, lastUpdated: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch Wikipedia data' });
  }
});
// Airtable - Client CRM
app.get('/api/airtable', async (req, res) => {
  try {
    const data = await fetchWithCache('airtable',
      `https://api.airtable.com/v0/appSK4QsBBQKdhfcI/tblNHk8MSPT7mnlh9`,
      900,
      {
        headers: {
          'Authorization': `Bearer ${process.env.AIRTABLE_PAT}`
        }
      }
    );
    res.json({ data, lastUpdated: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch Airtable data' });
  }
});
// Notion - SOP Registry
app.get('/api/notion', async (req, res) => {
  try {
    const response = await fetch(
      `https://api.notion.com/v1/databases/3908ed8bfacb808e8873c564cf6e356d/query`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.NOTION_TOKEN}`,
          'Notion-Version': '2022-06-28',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
      }
    );
    const data = await response.json();
    cache.set('notion', data, 900);
    res.json({ data, lastUpdated: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch Notion data' });
  }
});
// NewsAPI - business headlines
app.get('/api/news', async (req, res) => {
  try {
    const data = await fetchWithCache('news-v3',
      `https://newsapi.org/v2/everything?q=india&language=en&sortBy=publishedAt&pageSize=5&apiKey=${process.env.NEWSAPI_KEY}`, 1800);
    res.json({ data, lastUpdated: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch news data' });
  }
});