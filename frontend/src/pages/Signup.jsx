import React, { useState } from 'react'
import { registerUser } from '../services/api'

export default function Signup({ onNavigate }) {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
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
        onNavigate('transactions')
      } else {
        setError(res?.message || 'Inscription échouée')
      }
    } catch (e) {
      setError('Inscription impossible')
    }
  }
  return (
    <div style={{ padding: '16px', maxWidth: 420, margin: '0 auto' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ margin: 0 }}>Inscription</h1>
        <button onClick={() => onNavigate('home')} style={{ padding: '8px 12px' }}>Accueil</button>
      </header>

      <form style={{ display: 'grid', gap: 12, marginTop: 16 }} onSubmit={handleSubmit}>
        <input type="text" placeholder="Prénom" value={firstName} onChange={(e) => setFirstName(e.target.value)} style={{ padding: '10px 12px' }} />
        <input type="text" placeholder="Nom" value={lastName} onChange={(e) => setLastName(e.target.value)} style={{ padding: '10px 12px' }} />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ padding: '10px 12px' }} />
        <input type="password" placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} style={{ padding: '10px 12px' }} />
        <input type="password" placeholder="Confirmation du mot de passe" value={passwordConfirm} onChange={(e) => setPasswordConfirm(e.target.value)} style={{ padding: '10px 12px' }} />
        <button type="submit" style={{ padding: '10px 12px' }}>Créer un compte</button>
        {error && <div style={{ color: 'crimson' }}>{error}</div>}
      </form>
    </div>
  )
}