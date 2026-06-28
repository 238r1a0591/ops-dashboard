import { useState, useEffect } from 'react'

function App() {
  const [crypto, setCrypto] = useState(null)

  useEffect(() => {
    fetch('http://localhost:5000/api/crypto')
      .then(res => res.json())
      .then(data => setCrypto(data))
  }, [])

  return (
    <div style={{ padding: '40px', fontFamily: 'Arial' }}>
      <h1>Ops Dashboard</h1>
      
      <h2>Live Crypto Prices</h2>
      {crypto ? (
        <div>
          <p>Bitcoin: ${crypto.bitcoin.usd.toLocaleString()}</p>
          <p>Ethereum: ${crypto.ethereum.usd.toLocaleString()}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  )
}

export default App