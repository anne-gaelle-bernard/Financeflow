import React, { useEffect, useMemo, useState } from 'react'
import { setAuthToken, fetchTransactions } from '../services/api'

export default function Home({ onNavigate }) {
  const [isAuth, setIsAuth] = useState(() => (typeof window !== 'undefined' ? !!localStorage.getItem('ff_token') : false))
  const [user, setUser] = useState(() => {
    try {
      const raw = typeof window !== 'undefined' ? localStorage.getItem('ff_user') : null
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  })
  const [items, setItems] = useState([])
  const totalBalance = useMemo(() => {
    try {
      return items.reduce((sum, tx) => sum + (Number(tx.amount) || 0), 0)
    } catch {
      return 0
    }
  }, [items])

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('ff_token') : null
    if (!token) {
      setIsAuth(false)
      onNavigate('login')
    } else {
      setIsAuth(true)
    }
  }, [])

  useEffect(() => {
    async function load() {
      try {
        const res = await fetchTransactions({ sort: 'date_desc' })
        setItems(Array.isArray(res?.data) ? res.data : [])
      } catch {}
    }
    if (isAuth) load()
  }, [isAuth])

  function handleLogout() {
    setAuthToken(null)
    setIsAuth(false)
    onNavigate('login')
  }
  return (
    <div style={{ padding: '16px', maxWidth: 800, margin: '0 auto' }}>
      <h1 style={{ marginTop: 0, letterSpacing: 1 }}>ACCUEIL UTILISATEUR</h1>
      <div style={{ background: '#fff', borderRadius: 12, padding: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.12)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>👤</div>
          <div>
            <div style={{ fontWeight: 700 }}>Bienvenue {user?.firstName || 'utilisateur'}</div>
            <div style={{ fontSize: 13, color: '#666' }}>Total Balance : {totalBalance.toFixed(2)}€</div>
          </div>
          <div style={{ marginLeft: 'auto' }}>🔔</div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginTop: 20 }}>
          <div style={{ border: '1px solid #ddd', borderRadius: 8, padding: 16, textAlign: 'center', fontWeight: 600 }}>Income</div>
          <div style={{ border: '1px solid #ddd', borderRadius: 8, padding: 16, textAlign: 'center', fontWeight: 600 }}>Expenses</div>
          <div style={{ border: '1px solid #ddd', borderRadius: 8, padding: 16, textAlign: 'center', fontWeight: 600 }}>Saving</div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginTop: 16 }}>
          <button style={{ padding: 12, borderRadius: 50, border: '1px solid #ddd' }}>Add New</button>
          <button style={{ padding: 12, borderRadius: 50, border: '1px solid #ddd' }}>Income</button>
          <button style={{ padding: 12, borderRadius: 50, border: '1px solid #ddd' }}>Expense</button>
          <button style={{ padding: 12, borderRadius: 50, border: '1px solid #ddd' }}>Transfer</button>
        </div>

        <div style={{ marginTop: 20 }}>
          <div style={{ fontWeight: 700, marginBottom: 8 }}>Goals</div>
          <div style={{ background: '#fafafa', borderRadius: 8, padding: 12, marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
              <span>Vacation</span><span>$3,500</span>
            </div>
            <div style={{ background: '#eee', borderRadius: 8, height: 10, marginTop: 8 }}>
              <div style={{ width: '60%', background: '#38A169', height: '100%', borderRadius: 8 }}></div>
            </div>
            <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>$2,100 • 60%</div>
          </div>
          <div style={{ background: '#fafafa', borderRadius: 8, padding: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
              <span>New Car</span><span>$20,000</span>
            </div>
            <div style={{ background: '#eee', borderRadius: 8, height: 10, marginTop: 8 }}>
              <div style={{ width: '40%', background: '#3182CE', height: '100%', borderRadius: 8 }}></div>
            </div>
            <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>$8,000 • 40%</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8, position: 'fixed', bottom: 12, left: 0, right: 0, maxWidth: 800, margin: '0 auto' }}>
        <button style={{ padding: 12 }}>Dashboard</button>
        <button onClick={() => onNavigate('transactions')} style={{ padding: 12 }}>Transactions</button>
        <button style={{ padding: 12 }}>Budgets</button>
        <button style={{ padding: 12 }}>Reports</button>
        {isAuth ? (
          <button onClick={handleLogout} style={{ padding: 12 }}>Settings</button>
        ) : (
          <button onClick={() => onNavigate('login')} style={{ padding: 12 }}>Settings</button>
        )}
      </div>
    </div>
  )
}
