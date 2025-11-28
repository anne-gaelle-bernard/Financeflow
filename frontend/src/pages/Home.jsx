import React, { useEffect, useState } from 'react'
import { setAuthToken } from '../services/api'

export default function Home({ onNavigate }) {
  const [isAuth, setIsAuth] = useState(() => (typeof window !== 'undefined' ? !!localStorage.getItem('ff_token') : false))

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('ff_token') : null
    if (!token) {
      setIsAuth(false)
      onNavigate('login')
    } else {
      setIsAuth(true)
    }
  }, [])

  function handleLogout() {
    setAuthToken(null)
    setIsAuth(false)
    onNavigate('login')
  }
  return (
    <div style={{ padding: '16px', maxWidth: 800, margin: '0 auto' }}>
      <h1 style={{ marginTop: 0 }}>FinanceFlow</h1>
      <p style={{ color: 'var(--muted)' }}>
        Gérez vos finances, suivez vos transactions et visualisez vos dépenses.
      </p>

      <div style={{ display: 'grid', gap: 8, gridTemplateColumns: '1fr 1fr' }}>
        <button onClick={() => onNavigate('transactions')} style={{ padding: '10px 12px' }}>Transactions</button>
        {!isAuth && <button onClick={() => onNavigate('login')} style={{ padding: '10px 12px' }}>Connexion</button>}
        {!isAuth && <button onClick={() => onNavigate('signup')} style={{ padding: '10px 12px' }}>Inscription</button>}
        {isAuth && <button onClick={handleLogout} style={{ padding: '10px 12px' }}>Déconnexion</button>}
      </div>
    </div>
  )
}
