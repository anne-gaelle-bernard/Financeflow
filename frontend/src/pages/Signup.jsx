import React, { useState } from 'react'
import { registerUser, setAuthToken } from '../services/api'

export default function Signup({ onNavigate }) {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [showPwd2, setShowPwd2] = useState(false)
  const [error, setError] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    if (!firstName || !lastName || !email || !password || !passwordConfirm) {
      setError('Tous les champs sont requis')
      return
    }
    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères')
      return
    }
    if (password !== passwordConfirm) {
      setError('Les mots de passe ne correspondent pas')
      return
    }
    try {
      const res = await registerUser({ firstName, lastName, email, password, passwordConfirm })
      if (res?.success) {
        setAuthToken(null)
        onNavigate('login')
      } else {
        setError(res?.message || 'Inscription échouée')
      }
    } catch (e) {
      setError('Inscription impossible')
    }
  }

  const primary = '#10b981'
  const cardBg = 'rgba(20, 44, 40, 0.75)'
  const border = '1px solid rgba(255,255,255,0.08)'
  const muted = '#94a3b8'

  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: 'radial-gradient(80% 80% at 80% 80%, #0d3b34 0%, #06231f 70%)', padding: 24 }}>
      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <div style={{ width: 64, height: 64, borderRadius: 18, background: 'linear-gradient(135deg,#0ea5e9,#10b981)', boxShadow: '0 0 30px rgba(16,185,129,0.35)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 24 }}>↗</div>
        <div style={{ fontSize: 36, fontWeight: 800, color: '#e8fff6', marginTop: 12 }}>FinanceFlow</div>
        <div style={{ color: '#a7f3d0', fontSize: 14 }}>Créer votre compte</div>
      </div>
      <div style={{ width: 460, maxWidth: '95vw', background: cardBg, border: border, borderRadius: 16, boxShadow: '0 20px 40px rgba(0,0,0,0.35)', padding: 24 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 16 }}>
          <button style={{ padding: 12, borderRadius: 10, background: '#0b3a33', color: '#7dd3fc', fontWeight: 700, border }} onClick={() => onNavigate('login')}>Connexion</button>
          <button style={{ padding: 12, borderRadius: 10, background: 'linear-gradient(135deg,#14b8a6,#10b981)', color: '#0b1f1b', fontWeight: 800 }} onClick={() => onNavigate('signup')}>Inscription</button>
        </div>
        <form style={{ display: 'grid', gap: 12 }} onSubmit={handleSubmit}>
          <label style={{ fontSize: 13, color: muted }}>Prénom</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', alignItems: 'center', gap: 10, background: '#0b3a33', border: border, borderRadius: 12, padding: '10px 12px' }}>
            <span style={{ color: '#86efac' }}>👤</span>
            <input type="text" placeholder="Prénom" value={firstName} onChange={(e) => setFirstName(e.target.value)} style={{ background: 'transparent', border: 'none', outline: 'none', color: '#e8fff6' }} />
          </div>
          <label style={{ fontSize: 13, color: muted }}>Nom</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', alignItems: 'center', gap: 10, background: '#0b3a33', border: border, borderRadius: 12, padding: '10px 12px' }}>
            <span style={{ color: '#86efac' }}>👤</span>
            <input type="text" placeholder="Nom" value={lastName} onChange={(e) => setLastName(e.target.value)} style={{ background: 'transparent', border: 'none', outline: 'none', color: '#e8fff6' }} />
          </div>
          <label style={{ fontSize: 13, color: muted }}>Email</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', alignItems: 'center', gap: 10, background: '#0b3a33', border: border, borderRadius: 12, padding: '10px 12px' }}>
            <span style={{ color: '#86efac' }}>✉️</span>
            <input type="email" placeholder="email@example.com" value={email} onChange={(e) => setEmail(e.target.value)} style={{ background: 'transparent', border: 'none', outline: 'none', color: '#e8fff6' }} />
          </div>
          <label style={{ fontSize: 13, color: muted }}>Mot de passe</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', alignItems: 'center', gap: 10, background: '#0b3a33', border: border, borderRadius: 12, padding: '10px 12px' }}>
            <span style={{ color: '#86efac' }}>🔒</span>
            <input type={showPwd ? 'text' : 'password'} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} style={{ background: 'transparent', border: 'none', outline: 'none', color: '#e8fff6' }} />
            <button type="button" onClick={() => setShowPwd(s => !s)} style={{ color: '#7dd3fc', background: 'transparent', border: 'none' }}>👁</button>
          </div>
          <label style={{ fontSize: 13, color: muted }}>Confirmation du mot de passe</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', alignItems: 'center', gap: 10, background: '#0b3a33', border: border, borderRadius: 12, padding: '10px 12px' }}>
            <span style={{ color: '#86efac' }}>🔒</span>
            <input type={showPwd2 ? 'text' : 'password'} placeholder="••••••••" value={passwordConfirm} onChange={(e) => setPasswordConfirm(e.target.value)} style={{ background: 'transparent', border: 'none', outline: 'none', color: '#e8fff6' }} />
            <button type="button" onClick={() => setShowPwd2(s => !s)} style={{ color: '#7dd3fc', background: 'transparent', border: 'none' }}>👁</button>
          </div>
          <button type="submit" style={{ padding: 14, borderRadius: 12, background: 'linear-gradient(135deg,#22d3ee,#10b981)', color: '#04221d', fontWeight: 800 }}>Créer un compte →</button>
          {error && <div style={{ color: '#fecaca', background: 'rgba(120,0,0,0.2)', borderRadius: 8, padding: '8px 10px', fontSize: 14 }}>{error}</div>}
        </form>
      </div>
      <div style={{ position: 'fixed', bottom: 20, color: '#7dd3fc', fontSize: 12 }}>© 2024 FinanceFlow • Sécurisé et fiable</div>
    </div>
  )
}
