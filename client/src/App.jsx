import { useState, useEffect } from 'react'

const API = "https://ops-dashboard-server.onrender.com";

const ROLE_WIDGETS = {
  founder: ['all'],
  analyst: ['hackernews', 'reddit', 'who', 'wikipedia', 'secedgar', 'hnhiring', 'aqi', 'weather', 'airquality', 'notion', 'sopboard', 'airtable', 'newsapi']
}

const NAV_ITEMS = [
  { id: 'crypto', label: 'Crypto Prices', role: ['founder'] },
  { id: 'fx', label: 'FX Rates', role: ['founder'] },
  { id: 'weather', label: 'Weather', role: ['founder', 'analyst'] },
  { id: 'aqi', label: 'Air Quality', role: ['founder', 'analyst'] },
  { id: 'airquality', label: 'PM2.5 Forecast', role: ['founder', 'analyst'] },
  { id: 'stocks', label: 'Stock Market', role: ['founder'] },
  { id: 'worldbank', label: 'India GDP', role: ['founder'] },
  { id: 'economics', label: 'US CPI', role: ['founder'] },
  { id: 'newsapi', label: 'Business News', role: ['founder', 'analyst'] },
  { id: 'clockify', label: 'Clockify', role: ['founder'] },
  { id: 'notion', label: 'SOP Registry', role: ['founder', 'analyst'] },
  { id: 'sopboard', label: 'Trello Board', role: ['founder', 'analyst'] },
  { id: 'hackernews', label: 'Tech News', role: ['founder', 'analyst'] },
  { id: 'reddit', label: 'Reddit', role: ['founder', 'analyst'] },
  { id: 'hr', label: 'Team Directory', role: ['founder'] },
  { id: 'remoteok', label: 'Remote Jobs', role: ['founder'] },
  { id: 'who', label: 'WHO Health', role: ['founder', 'analyst'] },
  { id: 'wikipedia', label: 'Wikipedia', role: ['founder', 'analyst'] },
  { id: 'airtable', label: 'Client CRM', role: ['founder', 'analyst'] },
  { id: 'secedgar', label: 'SEC Filings', role: ['founder', 'analyst'] },
  { id: 'hnhiring', label: "Who's Hiring", role: ['founder'] },
  { id: 'usajobs', label: 'Federal Jobs', role: ['founder'] },
]

function KPICard({ title, value, color }) {
  return (
    <div style={{ background: 'white', padding: '20px', borderRadius: '12px', flex: 1, minWidth: '150px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
      <p style={{ color: '#888', margin: 0, fontSize: '13px' }}>{title}</p>
      <h2 style={{ margin: '8px 0 4px', color: color || '#1a1a2e' }}>{value || 'Unavailable'}</h2>
    </div>
  )
}

function SectionTitle({ title, id }) {
  return <h2 id={id} style={{ color: '#1a1a2e', marginTop: '28px', marginBottom: '12px', fontSize: '16px', borderLeft: '4px solid #3b82f6', paddingLeft: '10px' }}>{title}</h2>
}

function LoginScreen({ onLogin }) {
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState(null)

  const roles = [
    { id: 'founder', label: 'Founder', desc: 'Full access to all 25 data sources', color: '#1a1a2e' },
    { id: 'analyst', label: 'Analyst', desc: 'News, Health, Intelligence, SOP data', color: '#3b82f6' },
  ]

  const handleLogin = async () => {
    if (!selected) return
    setLoading(true)
    setErrorMsg(null)

    const credentials = {
      founder: { email: 'founder@ops.com', password: 'founder123' },
      analyst: { email: 'analyst@ops.com', password: 'analyst123' }
    }

    const user = credentials[selected]

    try {
      const response = await fetch(`${API}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
      })
      const data = await response.json()

      if (response.ok) {
        localStorage.setItem('token', data.token)
        localStorage.setItem('role', data.role)
        onLogin(data.role)
      } else {
        setErrorMsg(data.message || 'Login failed')
      }
    } catch (err) {
      setErrorMsg('Server not reachable. Try again in a moment.')
    }

    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f0f2f5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Arial' }}>
      <div style={{ background: 'white', borderRadius: '16px', padding: '40px', maxWidth: '480px', width: '100%', boxShadow: '0 4px 24px rgba(0,0,0,0.1)' }}>
        <h1 style={{ color: '#1a1a2e', margin: '0 0 8px' }}>Ops Dashboard</h1>
        <p style={{ color: '#888', margin: '0 0 32px', fontSize: '14px' }}>Select your role to log in</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {roles.map(role => (
            <div key={role.id}
              onClick={() => setSelected(role.id)}
              style={{
                border: `2px solid ${selected === role.id ? role.color : '#e5e7eb'}`,
                borderRadius: '10px', padding: '16px', cursor: 'pointer',
                background: selected === role.id ? `${role.color}10` : 'white',
                transition: 'all 0.15s'
              }}>
              <div style={{ fontWeight: 'bold', color: role.color, fontSize: '15px' }}>{role.label}</div>
              <div style={{ color: '#888', fontSize: '13px', marginTop: '4px' }}>{role.desc}</div>
            </div>
          ))}
        </div>

        {errorMsg && (
          <p style={{ color: '#c53030', fontSize: '13px', marginTop: '16px', marginBottom: 0 }}>{errorMsg}</p>
        )}

        <button
          onClick={handleLogin}
          disabled={!selected || loading}
          style={{
            marginTop: '24px', width: '100%', padding: '14px',
            background: selected ? '#1a1a2e' : '#e5e7eb',
            color: selected ? 'white' : '#aaa',
            border: 'none', borderRadius: '10px', fontSize: '15px',
            fontWeight: 'bold', cursor: selected ? 'pointer' : 'not-allowed'
          }}>
          {loading ? 'Logging in...' : 'Enter Dashboard'}
        </button>

        <p style={{ color: '#bbb', fontSize: '11px', textAlign: 'center', marginTop: '16px' }}>
          Founder: founder@ops.com / founder123 · Analyst: analyst@ops.com / analyst123
        </p>
      </div>
    </div>
  )
}

function App() {
  const [role, setRole] = useState(null)
  const [activeSection, setActiveSection] = useState(null)
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
  const [notion, setNotion] = useState(null)
  const [airtable, setAirtable] = useState(null)
  const [who, setWho] = useState(null)
  const [wikipedia, setWikipedia] = useState(null)
  const [remoteok, setRemoteok] = useState(null)
  const [actionQueue, setActionQueue] = useState(null)
  const [secEdgar, setSecEdgar] = useState(null)
  const [hnHiring, setHnHiring] = useState(null)
  const [usajobs, setUsajobs] = useState(null)
  const [clockify, setClockify] = useState(null)
  const [newsapi, setNewsapi] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)
  const [loading, setLoading] = useState(true)

  // Auto-login from localStorage on page refresh
  useEffect(() => {
    const savedRole = localStorage.getItem('role')
    if (savedRole) setRole(savedRole)
  }, [])

  useEffect(() => {
    if (!role) return

    const safeFetch = async (url) => {
      try {
        const token = localStorage.getItem('token')
        const res = await fetch(url, {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        })
        return await res.json()
      } catch (err) {
        return { data: null, error: true }
      }
    }

    const fetchAll = async () => {
      const [c, f, n, h, a, s, sop, wb, aq2, rd, wt, ec, nt, at, wh, wiki, rok, aq3, sec, hnh, uj, cl, na] = await Promise.all([
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
        safeFetch(`${API}/api/notion`),
        safeFetch(`${API}/api/airtable`),
        safeFetch(`${API}/api/who`),
        safeFetch(`${API}/api/wikipedia`),
        safeFetch(`${API}/api/remoteok`),
        safeFetch(`${API}/api/check-triggers`),
        safeFetch(`${API}/api/sec-edgar`),
        safeFetch(`${API}/api/hn-hiring`),
        safeFetch(`${API}/api/usajobs`),
        safeFetch(`${API}/api/clockify`),
        safeFetch(`${API}/api/news`),
      ])

      setCrypto(c?.data?.bitcoin ? c.data : null)
      setFx(f?.data?.rates ? f.data : null)
      setNews(Array.isArray(n?.data) ? n.data : null)
      setHr(h?.data?.results ? h.data : null)
      setAqi(a?.data?.data ? a.data.data : null)
      setStocks(s?.data?.['Global Quote'] ? s.data['Global Quote'] : null)
      setSopBoard(Array.isArray(sop?.data) ? sop.data : null)
      setWorldbank(Array.isArray(wb?.data) && wb.data[1] ? (wb.data[1].find(item => item.value !== null) || null) : null)
      setAirquality(aq2?.data?.hourly ? aq2.data : null)
      setReddit(rd?.data?.data?.children ? rd.data.data.children : null)
      setWeather(wt?.data?.main ? wt.data : null)
      setEconomics(ec?.data?.observations ? ec.data.observations : null)
      setNotion(nt?.data?.results ? nt.data.results : null)
      setAirtable(at?.data?.records ? at.data.records : null)
      setWho(wh?.data?.value ? wh.data.value : null)
      setWikipedia(wiki?.data?.title ? wiki.data : null)
      setRemoteok(Array.isArray(rok?.data) ? rok.data : null)
      setActionQueue(aq3?.actionQueue ? aq3.actionQueue : null)
      setSecEdgar(sec?.data?.filings ? sec.data : null)
      setHnHiring(Array.isArray(hnh?.data) ? hnh.data : null)
      setUsajobs(Array.isArray(uj?.data) ? uj.data : null)
      setClockify(Array.isArray(cl?.data) ? cl.data : null)
      setNewsapi(na?.data?.articles ? na.data.articles : null)
      setLastUpdated(new Date().toLocaleTimeString())
      setLoading(false)
    }

    fetchAll()
  }, [role])

  const canSee = (widgetId) => {
    if (!role) return false
    if (role === 'founder') return true
    return ROLE_WIDGETS[role]?.includes(widgetId)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    setRole(null)
    setLoading(true)
  }

  const visibleNav = NAV_ITEMS.filter(item => item.role.includes(role))

  if (!role) return <LoginScreen onLogin={setRole} />

  return (
    <div style={{ display: 'flex', fontFamily: 'Arial', minHeight: '100vh', background: '#f0f2f5' }}>

      {/* Sidebar */}
      <div style={{
        width: '220px', minHeight: '100vh', background: '#1a1a2e',
        padding: '24px 0', position: 'fixed', left: 0, top: 0, overflowY: 'auto'
      }}>
        <div style={{ padding: '0 20px 20px', borderBottom: '1px solid #333' }}>
          <h2 style={{ color: 'white', margin: 0, fontSize: '16px' }}>Ops Dashboard</h2>
          <div style={{ marginTop: '8px', background: '#3b82f6', borderRadius: '6px', padding: '4px 10px', display: 'inline-block' }}>
            <span style={{ color: 'white', fontSize: '12px', fontWeight: 'bold', textTransform: 'capitalize' }}>{role}</span>
          </div>
        </div>
        <div style={{ padding: '12px 0' }}>
          {visibleNav.map(item => (
            <a key={item.id} href={`#${item.id}`}
              onClick={() => setActiveSection(item.id)}
              style={{
                display: 'block', padding: '10px 20px', color: activeSection === item.id ? 'white' : '#aaa',
                background: activeSection === item.id ? '#3b82f6' : 'transparent',
                textDecoration: 'none', fontSize: '13px', cursor: 'pointer',
                borderLeft: activeSection === item.id ? '3px solid #60a5fa' : '3px solid transparent',
                transition: 'all 0.15s'
              }}>
              {item.label}
            </a>
          ))}
        </div>
        <div style={{ padding: '16px 20px', borderTop: '1px solid #333', marginTop: '8px' }}>
          <button onClick={handleLogout}
            style={{ background: 'transparent', border: '1px solid #555', color: '#aaa', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', width: '100%' }}>
            Log Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ marginLeft: '220px', padding: '24px', flex: 1 }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <h1 style={{ color: '#1a1a2e', margin: 0 }}>
            {role === 'founder' ? 'Founder Overview' : 'Analyst Dashboard'}
          </h1>
          <span style={{ fontSize: '12px', color: '#888' }}>Last Updated: {lastUpdated || 'Loading...'}</span>
        </div>
        <p style={{ color: '#888', marginTop: 0 }}>Live data from 25 sources • Cache enabled • Role: {role}</p>

        {/* SOP Action Queue */}
        {role === 'founder' && actionQueue && actionQueue.length > 0 && (
          <div style={{ marginTop: '8px' }}>
            <SectionTitle title="⚡ SOP Action Queue — Active Triggers" />
            {actionQueue.filter(a => !a.resolved).map((action, i) => (
              <div key={i} style={{
                background: '#fff5f5', border: '1px solid #feb2b2',
                borderRadius: '10px', padding: '14px 18px', marginBottom: '10px',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
              }}>
                <div>
                  <p style={{ margin: 0, fontWeight: 'bold', color: '#c53030', fontSize: '14px' }}>{action.sopId}</p>
                  <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#742a2a' }}>{action.reason}</p>
                  <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#888' }}>Assigned to: {action.assignee}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ margin: 0, fontSize: '11px', color: '#888' }}>SLA deadline</p>
                  <p style={{ margin: '2px 0 0', fontSize: '13px', fontWeight: 'bold', color: '#c53030' }}>
                    {new Date(action.slaDeadline).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Crypto */}
        {canSee('crypto') && <>
          <SectionTitle title="Crypto Prices" id="crypto" />
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <KPICard title="Bitcoin (BTC)" value={crypto ? `$${crypto.bitcoin.usd.toLocaleString()}` : (loading ? null : 'Rate limited')} color="#f7931a" />
            <KPICard title="Ethereum (ETH)" value={crypto ? `$${crypto.ethereum.usd.toLocaleString()}` : (loading ? null : 'Rate limited')} color="#627eea" />
          </div>
        </>}

        {/* FX */}
        {canSee('fx') && <>
          <SectionTitle title="FX Rates (from USD)" id="fx" />
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            {fx ? Object.entries(fx.rates).map(([currency, rate]) => (
              <KPICard key={currency} title={`USD → ${currency}`} value={rate} color="#2ecc71" />
            )) : <p style={{ color: '#888' }}>{loading ? 'Loading...' : 'Unavailable'}</p>}
          </div>
        </>}

        {/* Weather */}
        {canSee('weather') && <>
          <SectionTitle title="Weather — Hyderabad" id="weather" />
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <KPICard title="Temperature" value={weather ? `${weather.main.temp}°C` : null} color="#f39c12" />
            <KPICard title="Condition" value={weather?.weather?.[0]?.main || null} color="#3498db" />
            <KPICard title="Humidity" value={weather ? `${weather.main.humidity}%` : null} color="#2ecc71" />
          </div>
        </>}

        {/* AQI */}
        {canSee('aqi') && <>
          <SectionTitle title="Air Quality Index — Hyderabad" id="aqi" />
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <KPICard title="AQI Level" value={aqi?.aqi ? `${aqi.aqi} AQI` : null}
              color={aqi?.aqi > 150 ? '#e74c3c' : aqi?.aqi > 100 ? '#f39c12' : '#2ecc71'} />
            <KPICard title="Station" value={aqi?.city?.name || null} color="#3b82f6" />
          </div>
        </>}

        {/* PM2.5 */}
        {canSee('airquality') && <>
          <SectionTitle title="PM2.5 Forecast (Open-Meteo)" id="airquality" />
          <div style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            {airquality?.hourly?.pm2_5 ?
              <p style={{ fontSize: '13px', color: '#333' }}>Current PM2.5: <strong>{airquality.hourly.pm2_5[0]}</strong> µg/m³ · Next hour: <strong>{airquality.hourly.pm2_5[1]}</strong> µg/m³</p>
              : <p style={{ color: '#888' }}>{loading ? 'Loading...' : 'Unavailable'}</p>}
          </div>
        </>}

        {/* Stocks */}
        {canSee('stocks') && <>
          <SectionTitle title="Stock Market" id="stocks" />
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <KPICard title="Reliance BSE" value={stocks?.['05. price'] ? `₹${parseFloat(stocks['05. price']).toLocaleString()}` : (loading ? null : 'Daily limit reached')} color="#8b5cf6" />
            <KPICard title="Change %" value={stocks?.['10. change percent'] || null} color="#e74c3c" />
          </div>
        </>}

        {/* World Bank */}
        {canSee('worldbank') && <>
          <SectionTitle title="India GDP (World Bank)" id="worldbank" />
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <KPICard title={worldbank ? `GDP (${worldbank.date})` : 'GDP'}
              value={worldbank?.value ? `$${(worldbank.value / 1e12).toFixed(2)}T` : null} color="#16a085" />
          </div>
        </>}

        {/* FRED */}
        {canSee('economics') && <>
          <SectionTitle title="US CPI (Inflation) — FRED" id="economics" />
          <div style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            {economics ? economics.slice(0, 6).map((obs, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f0f0f0', fontSize: '13px' }}>
                <span style={{ color: '#888' }}>{obs.date}</span>
                <span style={{ fontWeight: 'bold', color: '#1a1a2e' }}>{obs.value}</span>
              </div>
            )) : <p style={{ color: '#888' }}>{loading ? 'Loading...' : 'Unavailable'}</p>}
          </div>
        </>}

        {/* NewsAPI */}
        {canSee('newsapi') && <>
          <SectionTitle title="Business Headlines (NewsAPI)" id="newsapi" />
          <div style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            {newsapi ? newsapi.slice(0, 5).map((article, i) => (
              <div key={i} style={{ padding: '10px 0', borderBottom: '1px solid #f0f0f0' }}>
                <a href={article.url} target="_blank" rel="noreferrer" style={{ color: '#1a1a2e', textDecoration: 'none', fontSize: '14px' }}>{article.title}</a>
                <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#888' }}>{article.source?.name}</p>
              </div>
            )) : <p style={{ color: '#888' }}>{loading ? 'Loading...' : 'Unavailable'}</p>}
          </div>
        </>}

        {/* Clockify */}
        {canSee('clockify') && <>
          <SectionTitle title="Workspaces (Clockify)" id="clockify" />
          <div style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            {clockify ? clockify.map((ws, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f0f0f0' }}>
                <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#1a1a2e' }}>{ws.name}</span>
                <span style={{ fontSize: '12px', color: '#888' }}>{ws.hourlyRate?.currency || 'USD'}</span>
              </div>
            )) : <p style={{ color: '#888' }}>{loading ? 'Loading...' : 'Unavailable'}</p>}
          </div>
        </>}

        {/* Notion */}
        {canSee('notion') && <>
          <SectionTitle title="SOP Registry (Notion)" id="notion" />
          <div style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            {notion ? notion.map((page, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f0f0f0' }}>
                <span style={{ fontSize: '14px', color: '#1a1a2e' }}>{page.properties?.Name?.title?.[0]?.plain_text || 'Untitled'}</span>
                <span style={{ fontSize: '12px', color: '#888' }}>{new Date(page.last_edited_time).toLocaleDateString()}</span>
              </div>
            )) : <p style={{ color: '#888' }}>{loading ? 'Loading...' : 'Unavailable'}</p>}
          </div>
        </>}

        {/* Trello */}
        {canSee('sopboard') && <>
          <SectionTitle title="SOP Tracker (Trello Kanban)" id="sopboard" />
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            {sopBoard ? sopBoard.map((list) => (
              <div key={list.id} style={{ background: 'white', borderRadius: '12px', padding: '16px', flex: '1', minWidth: '200px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ fontWeight: 'bold', color: '#1a1a2e', fontSize: '14px' }}>{list.name}</span>
                  <span style={{ background: '#f0f2f5', borderRadius: '12px', padding: '2px 10px', fontSize: '12px', color: '#888' }}>{list.cards.length}</span>
                </div>
                {list.cards.map((card) => (
                  <div key={card.id} style={{ background: '#f9fafb', borderRadius: '8px', padding: '10px', marginBottom: '8px', fontSize: '13px', color: '#333', border: '1px solid #f0f0f0' }}>
                    {card.name}
                  </div>
                ))}
              </div>
            )) : <p style={{ color: '#888' }}>{loading ? 'Loading...' : 'Unavailable'}</p>}
          </div>
        </>}

        {/* Hacker News */}
        {canSee('hackernews') && <>
          <SectionTitle title="Top Tech News" id="hackernews" />
          <div style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            {news ? news.map((story, i) => (
              <div key={i} style={{ padding: '10px 0', borderBottom: '1px solid #f0f0f0' }}>
                <a href={story.url} target="_blank" rel="noreferrer" style={{ color: '#1a1a2e', textDecoration: 'none', fontSize: '14px' }}>{story.title}</a>
                <span style={{ color: '#888', fontSize: '12px', marginLeft: '8px' }}>▲ {story.score} points</span>
              </div>
            )) : <p style={{ color: '#888' }}>{loading ? 'Loading...' : 'Unavailable'}</p>}
          </div>
        </>}

        {/* Reddit */}
        {canSee('reddit') && <>
          <SectionTitle title="Entrepreneur Community (Reddit)" id="reddit" />
          <div style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            {reddit ? reddit.slice(0, 5).map((post, i) => (
              <div key={i} style={{ padding: '10px 0', borderBottom: '1px solid #f0f0f0' }}>
                <span style={{ color: '#1a1a2e', fontSize: '14px' }}>{post.data.title}</span>
                <span style={{ color: '#888', fontSize: '12px', marginLeft: '8px' }}>▲ {post.data.ups}</span>
              </div>
            )) : <p style={{ color: '#888' }}>{loading ? 'Loading...' : 'Unavailable'}</p>}
          </div>
        </>}

        {/* HR */}
        {canSee('hr') && <>
          <SectionTitle title="Team Directory" id="hr" />
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
                )) : <tr><td colSpan="3" style={{ padding: '8px', color: '#888' }}>{loading ? 'Loading...' : 'Unavailable'}</td></tr>}
              </tbody>
            </table>
          </div>
        </>}

        {/* RemoteOK */}
        {canSee('remoteok') && <>
          <SectionTitle title="Remote Jobs (RemoteOK)" id="remoteok" />
          <div style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            {remoteok ? remoteok.map((job, i) => (
              <div key={i} style={{ padding: '10px 0', borderBottom: '1px solid #f0f0f0' }}>
                <a href={job.url} target="_blank" rel="noreferrer" style={{ color: '#1a1a2e', textDecoration: 'none', fontSize: '14px', fontWeight: 'bold' }}>{job.position}</a>
                <span style={{ color: '#888', fontSize: '12px', marginLeft: '8px' }}>{job.company}</span>
              </div>
            )) : <p style={{ color: '#888' }}>{loading ? 'Loading...' : 'Unavailable'}</p>}
          </div>
        </>}

        {/* WHO */}
        {canSee('who') && <>
          <SectionTitle title="Global Health Indicators (WHO)" id="who" />
          <div style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            {who ? who.slice(0, 5).map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f0f0f0', fontSize: '13px' }}>
                <span style={{ color: '#888' }}>{item.SpatialDim} — {item.TimeDim}</span>
                <span style={{ fontWeight: 'bold', color: '#1a1a2e' }}>{item.NumericValue ? item.NumericValue.toFixed(1) : 'N/A'}</span>
              </div>
            )) : <p style={{ color: '#888' }}>{loading ? 'Loading...' : 'Unavailable'}</p>}
          </div>
        </>}

        {/* Wikipedia */}
        {canSee('wikipedia') && <>
          <SectionTitle title="Company Intelligence (Wikipedia)" id="wikipedia" />
          <div style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            {wikipedia ? (
              <div>
                <p style={{ fontWeight: 'bold', color: '#1a1a2e', margin: '0 0 8px' }}>{wikipedia.title}</p>
                <p style={{ fontSize: '13px', color: '#555', margin: 0, lineHeight: '1.6' }}>{wikipedia.extract?.slice(0, 300)}...</p>
              </div>
            ) : <p style={{ color: '#888' }}>{loading ? 'Loading...' : 'Unavailable'}</p>}
          </div>
        </>}

        {/* Airtable */}
        {canSee('airtable') && <>
          <SectionTitle title="Client CRM (Airtable)" id="airtable" />
          <div style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            {airtable ? airtable.map((record, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f0f0f0' }}>
                <span style={{ fontSize: '14px', color: '#1a1a2e' }}>{record.fields?.Name || 'Unnamed'}</span>
                <span style={{ fontSize: '12px', color: '#888' }}>{new Date(record.createdTime).toLocaleDateString()}</span>
              </div>
            )) : <p style={{ color: '#888' }}>{loading ? 'Loading...' : 'Unavailable'}</p>}
          </div>
        </>}

        {/* SEC EDGAR */}
        {canSee('secedgar') && <>
          <SectionTitle title="SEC Filings — Apple Inc. (EDGAR)" id="secedgar" />
          <div style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            {secEdgar ? secEdgar.filings.map((filing, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f0f0f0', fontSize: '13px' }}>
                <span style={{ color: '#1a1a2e', fontWeight: 'bold' }}>Form {filing.form}</span>
                <span style={{ color: '#888' }}>{filing.filingDate}</span>
              </div>
            )) : <p style={{ color: '#888' }}>{loading ? 'Loading...' : 'Unavailable'}</p>}
          </div>
        </>}

        {/* HN Hiring */}
        {canSee('hnhiring') && <>
          <SectionTitle title="Who's Hiring (Hacker News)" id="hnhiring" />
          <div style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            {hnHiring ? hnHiring.map((comment, i) => (
              <div key={i} style={{ padding: '10px 0', borderBottom: '1px solid #f0f0f0' }}>
                <p style={{ fontSize: '13px', color: '#333', margin: 0 }}>
                  {comment.text ? comment.text.replace(/<[^>]*>/g, '').slice(0, 200) : 'No text'}...
                </p>
                <span style={{ fontSize: '11px', color: '#888' }}>by {comment.author}</span>
              </div>
            )) : <p style={{ color: '#888' }}>{loading ? 'Loading...' : 'Unavailable'}</p>}
          </div>
        </>}

        {/* USAJOBS */}
        {canSee('usajobs') && <>
          <SectionTitle title="Federal Job Openings (USAJOBS)" id="usajobs" />
          <div style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            {usajobs ? usajobs.map((job, i) => (
              <div key={i} style={{ padding: '10px 0', borderBottom: '1px solid #f0f0f0' }}>
                <a href={job.url} target="_blank" rel="noreferrer" style={{ color: '#1a1a2e', textDecoration: 'none', fontSize: '14px', fontWeight: 'bold' }}>{job.title}</a>
                <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#888' }}>{job.org} • {job.location}</p>
              </div>
            )) : <p style={{ color: '#888' }}>{loading ? 'Loading...' : 'Unavailable'}</p>}
          </div>
        </>}

        {/* Footer */}
        <div style={{ marginTop: '32px', textAlign: 'center', color: '#888', fontSize: '12px' }}>
          Ops Dashboard • Built with React + Node.js • Deployed on Vercel + Render
        </div>

      </div>
    </div>
  )
}

export default App