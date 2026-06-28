import { useState, useEffect } from 'react'

function App() {
  const [crypto, setCrypto] = useState(null)
  const [fx, setFx] = useState(null)
  const [news, setNews] = useState(null)
  const [hr, setHr] = useState(null)

  useEffect(() => {
    fetch('http://localhost:5000/api/crypto')
      .then(r => r.json()).then(setCrypto)

    fetch('http://localhost:5000/api/fx')
      .then(r => r.json()).then(setFx)

    fetch('http://localhost:5000/api/hackernews')
      .then(r => r.json()).then(setNews)

    fetch('http://localhost:5000/api/hr')
      .then(r => r.json()).then(setHr)
  }, [])

  return (
    <div style={{ padding: '24px', fontFamily: 'Arial', background: '#f0f2f5', minHeight: '100vh' }}>
      
      <h1 style={{ color: '#1a1a2e', marginBottom: '24px' }}>Ops Dashboard</h1>

      {/* Crypto Row */}
      <h2 style={{ color: '#333' }}>Crypto Prices</h2>
      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
        <div style={{ background: 'white', padding: '20px', borderRadius: '12px', flex: 1, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <p style={{ color: '#888', margin: 0 }}>Bitcoin</p>
          <h2 style={{ margin: '8px 0', color: '#f7931a' }}>
            {crypto ? `$${crypto.bitcoin.usd.toLocaleString()}` : 'Loading...'}
          </h2>
        </div>
        <div style={{ background: 'white', padding: '20px', borderRadius: '12px', flex: 1, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <p style={{ color: '#888', margin: 0 }}>Ethereum</p>
          <h2 style={{ margin: '8px 0', color: '#627eea' }}>
            {crypto ? `$${crypto.ethereum.usd.toLocaleString()}` : 'Loading...'}
          </h2>
        </div>
      </div>

      {/* FX Rates */}
      <h2 style={{ color: '#333' }}>FX Rates (USD)</h2>
      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
        {fx && Object.entries(fx.rates).map(([currency, rate]) => (
          <div key={currency} style={{ background: 'white', padding: '20px', borderRadius: '12px', flex: 1, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <p style={{ color: '#888', margin: 0 }}>{currency}</p>
            <h2 style={{ margin: '8px 0', color: '#2ecc71' }}>{rate}</h2>
          </div>
        ))}
        {!fx && <p>Loading...</p>}
      </div>

      {/* Hacker News */}
      <h2 style={{ color: '#333' }}>Top Tech News</h2>
      <div style={{ background: 'white', borderRadius: '12px', padding: '20px', marginBottom: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        {news ? news.map((story, i) => (
          <div key={i} style={{ padding: '10px 0', borderBottom: '1px solid #f0f0f0' }}>
            <a href={story.url} target="_blank" rel="noreferrer" style={{ color: '#1a1a2e', textDecoration: 'none' }}>
              {story.title}
            </a>
            <span style={{ color: '#888', fontSize: '12px', marginLeft: '8px' }}>
              {story.score} points
            </span>
          </div>
        )) : <p>Loading...</p>}
      </div>

      {/* HR Table */}
      <h2 style={{ color: '#333' }}>Team Directory</h2>
      <div style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #f0f0f0' }}>
              <th style={{ textAlign: 'left', padding: '8px', color: '#888' }}>Name</th>
              <th style={{ textAlign: 'left', padding: '8px', color: '#888' }}>Email</th>
              <th style={{ textAlign: 'left', padding: '8px', color: '#888' }}>Country</th>
            </tr>
          </thead>
          <tbody>
            {hr ? hr.results.map((person, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #f0f0f0' }}>
                <td style={{ padding: '8px' }}>{person.name.first} {person.name.last}</td>
                <td style={{ padding: '8px', color: '#888' }}>{person.email}</td>
                <td style={{ padding: '8px' }}>{person.location.country}</td>
              </tr>
            )) : <tr><td>Loading...</td></tr>}
          </tbody>
        </table>
      </div>

    </div>
  )
}

export default App