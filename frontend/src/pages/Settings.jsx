import React from 'react'

export default function Settings() {
  function clearSession() {
    localStorage.removeItem('ff_token')
    localStorage.removeItem('ff_user')
    window.location.href = '/login'
  }
  return (
    <div style={{ minHeight: '100vh', padding: 24, maxWidth: 900, margin: '0 auto', background: 'radial-gradient(80% 80% at 80% 80%, #0d3b34 0%, #06231f 70%)', color: '#e8fff6' }}>
      <div style={{ fontSize: 28, fontWeight: 800, marginBottom: 16 }}>Settings</div>
      <div style={{ background: 'rgba(20,44,40,0.75)', borderRadius: 16, padding: 16 }}>
        <button onClick={clearSession} style={{ padding: 12, borderRadius: 8 }}>Déconnexion</button>
      </div>
    </div>
  )
}
