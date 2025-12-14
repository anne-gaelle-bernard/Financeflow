import React, { useState } from 'react'
import { registerUser, setAuthToken } from '../services/api'
import { useNavigate } from 'react-router-dom'
import Logo from '../components/Logo'
import '../styles/main.css'

export default function Signup() {
  const navigate = useNavigate()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

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
      setLoading(true)
      const res = await registerUser({ firstName, lastName, email, password })
      if (res?.success) {
        // Inscription réussie - rediriger vers la page de connexion
        alert('Inscription réussie ! Veuillez vous connecter.')
        navigate('/login')
      } else {
        setError(res?.error || res?.message || 'Inscription échouée')
      }
    } catch (e) {
      console.error('Register error:', e)
      setError(e.response?.data?.error || 'Inscription impossible')
    }
    setLoading(false)
  }

  return (
    <div className="auth-container">
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
          <Logo size="large" variant="default" />
        </div>
        <p style={{ color: '#a7f3d0', fontSize: 14, margin: 0 }}>Créez votre compte</p>
      </div>
      
      <div className="auth-card">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 16 }}>
          <button 
            style={{ 
              padding: 12, 
              borderRadius: 10, 
              background: '#0b3a33', 
              color: '#7dd3fc', 
              fontWeight: 700, 
              border: '1px solid rgba(255,255,255,0.08)',
              cursor: 'pointer',
              minHeight: 44
            }} 
            onClick={() => navigate('/login')}
          >
            Connexion
          </button>
          <button 
            className="btn btn-primary" 
            style={{ padding: 12, width: '100%' }}
          >
            Inscription
          </button>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Prénom</label>
              <input 
                type="text" 
                placeholder="Jean" 
                value={firstName} 
                onChange={(e) => setFirstName(e.target.value)} 
              />
            </div>
            
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Nom</label>
              <input 
                type="text" 
                placeholder="Dupont" 
                value={lastName} 
                onChange={(e) => setLastName(e.target.value)} 
              />
            </div>
          </div>
          
          <div className="form-group">
            <label>Email</label>
            <input 
              type="email" 
              placeholder="jean.dupont@example.com" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
            />
          </div>
          
          <div className="form-group">
            <label>Mot de passe</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
            />
          </div>
          
          <div className="form-group">
            <label>Confirmer le mot de passe</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={passwordConfirm} 
              onChange={(e) => setPasswordConfirm(e.target.value)} 
            />
          </div>
          
          <button type="submit" disabled={loading} style={{ width: '100%' }}>
            {loading ? 'Inscription…' : 'Créer mon compte →'}
          </button>
        </form>
      </div>
      
      <div style={{ 
        marginTop: 20, 
        color: '#7dd3fc', 
        fontSize: 12, 
        textAlign: 'center' 
      }}>
        © 2024 FinanceFlow • Sécurisé et fiable
      </div>
    </div>
  )
}
