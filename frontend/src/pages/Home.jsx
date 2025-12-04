import React, { useEffect, useMemo, useState } from 'react'
import { setAuthToken, fetchTransactions } from '../services/api'

import { useNavigate } from 'react-router-dom'

export default function Home() {
  const navigate = useNavigate()
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
      navigate('/login', { replace: true })
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
  const border = '1px solid rgba(255,255,255,0.08)'
  const cardBg = 'rgba(20, 44, 40, 0.75)'
  const muted = '#94a3b8'
  return (
    <div style={{ minHeight: '100vh', padding: 24, maxWidth: 900, margin: '0 auto', background: 'radial-gradient(80% 80% at 80% 80%, #0d3b34 0%, #06231f 70%)' }}>
      <div style={{ textAlign: 'center', marginBottom: 16 }}>
        <div style={{ width: 64, height: 64, borderRadius: 18, background: 'linear-gradient(135deg,#0ea5e9,#10b981)', boxShadow: '0 0 30px rgba(16,185,129,0.35)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 24 }}></div>
        <div style={{ fontSize: 32, fontWeight: 800, color: '#e8fff6', marginTop: 10 }}>FinanceFlow</div>
        <div style={{ color: '#a7f3d0', fontSize: 14 }}>Tableau de bord</div>
      </div>
      <div style={{ background: cardBg, border: border, borderRadius: 16, padding: 16, boxShadow: '0 20px 40px rgba(0,0,0,0.35)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#0b3a33', border }}></div>
          <div>
            <div style={{ fontWeight: 800, color: '#e8fff6' }}>Bienvenue {user?.firstName || 'utilisateur'}</div>
            <div style={{ fontSize: 13, color: '#a7f3d0' }}>Total Balance : {totalBalance.toFixed(2)}€</div>
          </div>
          <div style={{ marginLeft: 'auto' }}></div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginTop: 20 }}>
          <div style={{ border: border, background: '#0b3a33', borderRadius: 8, padding: 16, textAlign: 'center', fontWeight: 700, color: '#e8fff6' }}>Income</div>
          <div style={{ border: border, background: '#0b3a33', borderRadius: 8, padding: 16, textAlign: 'center', fontWeight: 700, color: '#e8fff6' }}>Expenses</div>
          <div style={{ border: border, background: '#0b3a33', borderRadius: 8, padding: 16, textAlign: 'center', fontWeight: 700, color: '#e8fff6' }}>Saving</div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginTop: 16 }}>
          <button style={{ padding: 12, borderRadius: 50, border, background: '#0b3a33', color: '#7dd3fc' }}>Add New</button>
          <button style={{ padding: 12, borderRadius: 50, border, background: '#0b3a33', color: '#86efac' }}>Income</button>
          <button style={{ padding: 12, borderRadius: 50, border, background: '#0b3a33', color: '#fda4af' }}>Expense</button>
          <button style={{ padding: 12, borderRadius: 50, border, background: '#0b3a33', color: '#7dd3fc' }}>Transfer</button>
        </div>

        <div style={{ marginTop: 20 }}>
          <div style={{ fontWeight: 800, marginBottom: 8, color: '#e8fff6' }}>Goals</div>
          <div style={{ background: '#0b3a33', border, borderRadius: 8, padding: 12, marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
              <span style={{ color: '#e8fff6' }}>Vacation</span><span style={{ color: '#a7f3d0' }}>$3,500</span>
            </div>
            <div style={{ background: '#06231f', borderRadius: 8, height: 10, marginTop: 8 }}>
              <div style={{ width: '60%', background: '#10b981', height: '100%', borderRadius: 8 }}></div>
            </div>
            <div style={{ fontSize: 12, color: muted, marginTop: 4 }}>$2,100 • 60%</div>
          </div>
          <div style={{ background: '#0b3a33', border, borderRadius: 8, padding: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
              <span style={{ color: '#e8fff6' }}>New Car</span><span style={{ color: '#a7f3d0' }}>$20,000</span>
            </div>
            <div style={{ background: '#06231f', borderRadius: 8, height: 10, marginTop: 8 }}>
              <div style={{ width: '40%', background: '#22d3ee', height: '100%', borderRadius: 8 }}></div>
            </div>
            <div style={{ fontSize: 12, color: muted, marginTop: 4 }}>$8,000 • 40%</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8, position: 'fixed', bottom: 12, left: 0, right: 0, maxWidth: 900, margin: '0 auto' }}>
        <button style={{ padding: 12, borderRadius: 8, background: '#0b3a33', border, color: '#e8fff6' }}>Dashboard</button>
        <button onClick={() => navigate('/transactions')} style={{ padding: 12, borderRadius: 8, background: '#0b3a33', border, color: '#e8fff6' }}>Transactions</button>
        <button onClick={() => navigate('/budgets')} style={{ padding: 12, borderRadius: 8, background: '#0b3a33', border, color: '#e8fff6' }}>Budgets</button>
        <button onClick={() => navigate('/reports')} style={{ padding: 12, borderRadius: 8, background: '#0b3a33', border, color: '#e8fff6' }}>Reports</button>
        {isAuth ? (
          <button onClick={() => navigate('/settings')} style={{ padding: 12, borderRadius: 8, background: '#0b3a33', border, color: '#e8fff6' }}>Settings</button>
        ) : (
          <button onClick={() => navigate('/login')} style={{ padding: 12, borderRadius: 8, background: '#0b3a33', border, color: '#e8fff6' }}>Settings</button>
        )}
      </div>
    </div>
  )
}
