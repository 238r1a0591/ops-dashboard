import { useState, useEffect } from 'react'

const API = 'https://ops-dashboard-server.onrender.com'

function KPICard({ title, value, color }) {
  return (
    <div style={{ background: 'white', padding: '20px', borderRadius: '12px', flex: 1, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
      <p style={{ color: '#888', margin: 0, fontSize: '13px' }}>{title}</p>
      <h2 style={{ margin: '8px 0 4px', color: color || '#1a1a2e' }}>{value || 'Unavailable'}</h2>
    </div>
  )
}

function SectionTitle({ title }) {
  return <h2 style={{ color: '#1a1a2e', marginTop: '28px', marginBottom: '12px', fontSize: '16px', borderLeft: '4px solid #3b82f6', paddingLeft: '10px' }}>{title}</h2>
}

function App() {
  const [crypto, setCrypto] = useState(null)
  const [fx, setFx] = useState(null)
  const [news, setNews] = useState(null)
  const [hr, setHr] = useState(null)
  const [aqi, setAqi] = useState(null)
  const [stocks, setStocks] = useState(null)
  const [sopBoard, setSopBoard] = useState(null)
  const [worldbank, setWorldbank] = useState(null)
  const [airquality, setAirquality] = useState(null)
  const [reddit, setReddit] = useState(null)
  const [weather, setWeather] = useState(null)
  const [economics, setEconomics] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const safeFetch = async (url) => {
      try {
        const res = await fetch(url)
        return await res.json()
      } catch (err) {
        console.error('Fetch failed:', url, err)
        return { data: null, error: true }
      }
    }

    const fetchAll = async () => {
      const [c, f, n, h, a, s, sop, wb, aq2, rd, wt, ec] = await Promise.all([
        safeFetch(`${API}/api/crypto`),
        safeFetch(`${API}/api/fx`),
        safeFetch(`${API}/api/hackernews`),
        safeFetch(`${API}/api/hr`),
        safeFetch(`${API}/api/aqi`),
        safeFetch(`${API}/api/stocks`),
        safeFetch(`${API}/api/sop-board`),
        safeFetch(`${API}/api/worldbank`),
        safeFetch(`${API}/api/airquality`),
        safeFetch(`${API}/api/reddit`),
        safeFetch(`${API}/api/weather`),
        safeFetch(`${API}/api/economics`),
      ])

      setCrypto(c?.data?.bitcoin ? c.data : null)
      setFx(f?.data?.rates ? f.data : null)
      setNews(Array.isArray(n?.data) ? n.data : null)
      setHr(h?.data?.results ? h.data : null)
      setAqi(a?.data?.data ? a.data.data : null)
      setStocks(s?.data?.['Global Quote'] ? s.data : null)
      setSopBoard(Array.isArray(sop?.data) ? sop.data : null)
      setWorldbank(Array.isArray(wb?.data) && wb.data[1] ? (wb.data[1].find(item => item.value !== null) || null) : null)
      setAirquality(aq2?.data?.hourly ? aq2.data : null)
      setReddit(rd?.data?.data?.children ? rd.data.data.children : null)
      setWeather(wt?.data?.main ? wt.data : null)
      setEconomics(ec?.data?.observations ? ec.data.observations : null)
      setLastUpdated(new Date().toLocaleTimeString())
      setLoading(false)
    }

    fetchAll()
  }, [])

  return (
    <div style={{ padding: '24px', fontFamily: 'Arial', background: '#f0f2f5', minHeight: '100vh' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <h1 style={{ color: '#1a1a2e', margin: 0 }}>Ops Dashboard</h1>
        <span style={{ fontSize: '12px', color: '#888' }}>
          Last Updated: {lastUpdated || 'Loading...'}
        </span>
      </div>
      <p style={{ color: '#888', marginTop: 0 }}>Live data from 14 sources • Cache enabled</p>

      {/* Crypto */}
      <SectionTitle title="Crypto Prices" />
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        <KPICard title="Bitcoin (BTC)" value={crypto ? `$${crypto.bitcoin.usd.toLocaleString()}` : (loading ? null : 'Rate limited — try again shortly')} color="#f7931a" />
        <KPICard title="Ethereum (ETH)" value={crypto ? `$${crypto.ethereum.usd.toLocaleString()}` : (loading ? null : 'Rate limited — try again shortly')} color="#627eea" />
      </div>

      {/* FX Rates */}
      <SectionTitle title="FX Rates (from USD)" />
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        {fx ? Object.entries(fx.rates).map(([currency, rate]) => (
          <KPICard key={currency} title={`USD → ${currency}`} value={rate} color="#2ecc71" />
        )) : <p style={{ color: '#888' }}>{loading ? 'Loading...' : 'Unavailable right now'}</p>}
      </div>

      {/* Weather */}
      <SectionTitle title="Weather — Hyderabad" />
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        <KPICard title="Temperature" value={weather ? `${weather.main.temp}°C` : (loading ? null : 'Unavailable')} color="#f39c12" />
        <KPICard title="Condition" value={weather?.weather?.[0]?.main || (loading ? null : 'Unavailable')} color="#3498db" />
        <KPICard title="Humidity" value={weather ? `${weather.main.humidity}%` : (loading ? null : 'Unavailable')} color="#2ecc71" />
      </div>

      {/* AQI */}
      <SectionTitle title="Air Quality Index — Hyderabad" />
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        <KPICard
          title="AQI Level"
          value={aqi?.aqi ? `${aqi.aqi} AQI` : (loading ? null : 'Unavailable')}
          color={aqi?.aqi > 150 ? '#e74c3c' : aqi?.aqi > 100 ? '#f39c12' : '#2ecc71'}
        />
        <KPICard title="Station" value={aqi?.city?.name || (loading ? null : 'Unavailable')} color="#3b82f6" />
      </div>

      {/* PM2.5 Forecast */}
      <SectionTitle title="PM2.5 Forecast (Open-Meteo)" />
      <div style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        {airquality?.hourly?.pm2_5 ? (
          <p style={{ fontSize: '13px', color: '#333' }}>
            Current PM2.5: <strong>{airquality.hourly.pm2_5[0]}</strong> µg/m³ · Next hour: <strong>{airquality.hourly.pm2_5[1]}</strong> µg/m³
          </p>
        ) : <p style={{ color: '#888' }}>{loading ? 'Loading...' : 'Unavailable right now'}</p>}
      </div>

      {/* Stocks */}
      <SectionTitle title="Stock Market" />
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        <KPICard
          title="Reliance BSE"
          value={stocks?.['05. price'] ? `₹${parseFloat(stocks['05. price']).toLocaleString()}` : (loading ? null : 'Unavailable — daily limit reached')}
          color="#8b5cf6"
        />
        <KPICard
          title="Change %"
          value={stocks?.['10. change percent'] || (loading ? null : 'Unavailable')}
          color="#e74c3c"
        />
      </div>

      {/* World Bank */}
      <SectionTitle title="India GDP (World Bank)" />
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        <KPICard
          title={worldbank ? `GDP (${worldbank.date})` : 'GDP'}
          value={worldbank?.value ? `$${(worldbank.value / 1e12).toFixed(2)}T` : (loading ? null : 'Unavailable')}
          color="#16a085"
        />
      </div>

      {/* Economics - FRED */}
      <SectionTitle title="US CPI (Inflation) — FRED" />
      <div style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        {economics ? economics.slice(0, 6).map((obs, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f0f0f0', fontSize: '13px' }}>
            <span style={{ color: '#888' }}>{obs.date}</span>
            <span style={{ fontWeight: 'bold', color: '#1a1a2e' }}>{obs.value}</span>
          </div>
        )) : <p style={{ color: '#888' }}>{loading ? 'Loading...' : 'Unavailable right now'}</p>}
      </div>

      {/* SOP Board - Trello */}
      <SectionTitle title="SOP Tracker (Trello Kanban)" />
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        {sopBoard ? sopBoard.map((list) => (
          <div key={list.id} style={{ background: 'white', borderRadius: '12px', padding: '16px', flex: '1', minWidth: '220px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontWeight: 'bold', color: '#1a1a2e', fontSize: '14px' }}>{list.name}</span>
              <span style={{ background: '#f0f2f5', borderRadius: '12px', padding: '2px 10px', fontSize: '12px', color: '#888' }}>
                {list.cards.length}
              </span>
            </div>
            {list.cards.length > 0 ? list.cards.map((card) => (
              <div key={card.id} style={{ background: '#f9fafb', borderRadius: '8px', padding: '10px', marginBottom: '8px', fontSize: '13px', color: '#333', border: '1px solid #f0f0f0' }}>
                {card.name}
              </div>
            )) : <p style={{ color: '#bbb', fontSize: '12px' }}>No cards</p>}
          </div>
        )) : <p style={{ color: '#888' }}>{loading ? 'Loading...' : 'Unavailable right now'}</p>}
      </div>

      {/* Hacker News */}
      <SectionTitle title="Top Tech News" />
      <div style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        {news ? news.map((story, i) => (
          <div key={i} style={{ padding: '10px 0', borderBottom: '1px solid #f0f0f0' }}>
            <a href={story.url} target="_blank" rel="noreferrer"
              style={{ color: '#1a1a2e', textDecoration: 'none', fontSize: '14px' }}>
              {story.title}
            </a>
            <span style={{ color: '#888', fontSize: '12px', marginLeft: '8px' }}>
              ▲ {story.score} points
            </span>
          </div>
        )) : <p style={{ color: '#888' }}>{loading ? 'Loading...' : 'Unavailable right now'}</p>}
      </div>

      {/* Reddit */}
      <SectionTitle title="Entrepreneur Community (Reddit)" />
      <div style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        {reddit ? reddit.slice(0, 5).map((post, i) => (
          <div key={i} style={{ padding: '10px 0', borderBottom: '1px solid #f0f0f0' }}>
            <span style={{ color: '#1a1a2e', fontSize: '14px' }}>{post.data.title}</span>
            <span style={{ color: '#888', fontSize: '12px', marginLeft: '8px' }}>▲ {post.data.ups}</span>
          </div>
        )) : <p style={{ color: '#888' }}>{loading ? 'Loading...' : 'Unavailable right now'}</p>}
      </div>

      {/* HR Table */}
      <SectionTitle title="Team Directory" />
      <div style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #f0f0f0' }}>
              <th style={{ textAlign: 'left', padding: '8px', color: '#888', fontSize: '13px' }}>Name</th>
              <th style={{ textAlign: 'left', padding: '8px', color: '#888', fontSize: '13px' }}>Email</th>
              <th style={{ textAlign: 'left', padding: '8px', color: '#888', fontSize: '13px' }}>Country</th>
            </tr>
          </thead>
          <tbody>
            {hr ? hr.results.map((person, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #f0f0f0' }}>
                <td style={{ padding: '8px', fontSize: '14px' }}>{person.name.first} {person.name.last}</td>
                <td style={{ padding: '8px', fontSize: '14px', color: '#888' }}>{person.email}</td>
                <td style={{ padding: '8px', fontSize: '14px' }}>{person.location.country}</td>
              </tr>
            )) : <tr><td colSpan="3" style={{ padding: '8px', color: '#888' }}>{loading ? 'Loading...' : 'Unavailable right now'}</td></tr>}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div style={{ marginTop: '32px', textAlign: 'center', color: '#888', fontSize: '12px' }}>
        Ops Dashboard • Built with React + Node.js • Deployed on Vercel + Render
      </div>

    </div>
  )
}

export default App