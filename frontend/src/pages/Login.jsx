import React, { useState } from 'react'
import { loginUser } from '../services/api'

export default function Login({ onNavigate }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
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
        onNavigate('home')
      } else {
        setError(res?.message || 'Connexion échouée')
      }
    } catch (e) {
      setError('Connexion impossible')
    }
  }

  return (
    <div style={{ padding: '16px', maxWidth: 420, margin: '0 auto' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ margin: 0 }}>Connexion</h1>
        <button onClick={() => onNavigate('home')} style={{ padding: '8px 12px' }}>Accueil</button>
      </header>

      <form style={{ display: 'grid', gap: 12, marginTop: 16 }} onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ padding: '10px 12px' }} />
        <input type="password" placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} style={{ padding: '10px 12px' }} />
        <button type="submit" style={{ padding: '10px 12px' }}>Se connecter</button>
        {error && <div style={{ color: 'crimson' }}>{error}</div>}
      </form>
    </div>
  )
}
