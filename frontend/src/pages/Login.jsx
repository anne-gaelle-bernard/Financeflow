import React, { useState } from 'react'
import { loginUser } from '../services/api'

export default function Login({ onNavigate }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [error, setError] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    try {
      if (!email || !password) {
        setError('Email et mot de passe requis')
        return
      }
      const res = await loginUser({ email, password })
      if (res?.success) {
        try {
          const u = res?.data?.user
          if (u) localStorage.setItem('ff_user', JSON.stringify(u))
        } catch {}
        onNavigate('home')
      } else {
        setError(res?.message || 'Connexion échouée')
      }
    } catch (e) {
      setError('Connexion impossible')
    }
  }

  const primary = '#10b981'
  const primaryDark = '#0f766e'
  const cardBg = 'rgba(20, 44, 40, 0.75)'
  const border = '1px solid rgba(255,255,255,0.08)'
  const muted = '#94a3b8'

  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: 'radial-gradient(80% 80% at 80% 80%, #0d3b34 0%, #06231f 70%)', padding: 24 }}>
      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <div style={{ width: 64, height: 64, borderRadius: 18, background: 'linear-gradient(135deg,#0ea5e9,#10b981)', boxShadow: '0 0 30px rgba(16,185,129,0.35)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 24 }}>↗</div>
        <div style={{ fontSize: 36, fontWeight: 800, color: '#e8fff6', marginTop: 12 }}>FinanceFlow</div>
        <div style={{ color: '#a7f3d0', fontSize: 14 }}>Bienvenue de retour</div>
      </div>
      <div style={{ width: 460, maxWidth: '95vw', background: cardBg, border: border, borderRadius: 16, boxShadow: '0 20px 40px rgba(0,0,0,0.35)', padding: 24 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 16 }}>
          <button style={{ padding: 12, borderRadius: 10, background: 'linear-gradient(135deg,#14b8a6,#10b981)', color: '#0b1f1b', fontWeight: 800 }} onClick={() => onNavigate('login')}>Connexion</button>
          <button style={{ padding: 12, borderRadius: 10, background: '#0b3a33', color: '#7dd3fc', fontWeight: 700, border }} onClick={() => onNavigate('signup')}>Inscription</button>
        </div>
        <form style={{ display: 'grid', gap: 12 }} onSubmit={handleSubmit}>
          <label style={{ fontSize: 13, color: muted }}>Email</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', alignItems: 'center', gap: 10, background: '#0b3a33', border: border, borderRadius: 12, padding: '10px 12px' }}>
            <span style={{ color: '#86efac' }}>✉️</span>
            <input type="email" placeholder="votre@email.com" value={email} onChange={(e) => setEmail(e.target.value)} style={{ background: 'transparent', border: 'none', outline: 'none', color: '#e8fff6' }} />
          </div>
          <label style={{ fontSize: 13, color: muted }}>Mot de passe</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', alignItems: 'center', gap: 10, background: '#0b3a33', border: border, borderRadius: 12, padding: '10px 12px' }}>
            <span style={{ color: '#86efac' }}>🔒</span>
            <input type={showPwd ? 'text' : 'password'} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} style={{ background: 'transparent', border: 'none', outline: 'none', color: '#e8fff6' }} />
            <button type="button" onClick={() => setShowPwd(s => !s)} style={{ color: '#7dd3fc', background: 'transparent', border: 'none' }}>👁</button>
          </div>
          <div style={{ textAlign: 'right', fontSize: 12, color: muted }}>Mot de passe oublié ?</div>
          <button type="submit" style={{ padding: 14, borderRadius: 12, background: 'linear-gradient(135deg,#22d3ee,#10b981)', color: '#04221d', fontWeight: 800 }}>Se connecter →</button>
          {error && <div style={{ color: '#fecaca', background: 'rgba(120,0,0,0.2)', borderRadius: 8, padding: '8px 10px', fontSize: 14 }}>{error}</div>}
        </form>
      </div>
      <div style={{ position: 'fixed', bottom: 20, color: '#7dd3fc', fontSize: 12 }}>© 2024 FinanceFlow • Sécurisé et fiable</div>
    </div>
  )
}
