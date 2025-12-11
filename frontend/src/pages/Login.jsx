import React, { useState } from 'react'
import { loginUser, setAuthToken } from '../services/api'
import { useNavigate } from 'react-router-dom'
import Logo from '../components/Logo'
import '../styles/main.css'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    try {
      if (!email || !password) {
        setError("Email ou nom d'utilisateur et mot de passe requis")
        return
      }
      setLoading(true)
      const res = await loginUser({ email, password })
      if (res?.success && res?.data?.token && res?.data?.user) {
        const user = res.data.user
        const token = res.data.token
        localStorage.setItem('ff_user', JSON.stringify({ _id: user._id, userId: user._id, ...user }))
        localStorage.setItem('ff_token', token)
        setAuthToken(token)
        navigate('/')
      } else {
        setError(res?.error || res?.message || 'Connexion échouée')
      }
    } catch (e) {
      console.error('Login error:', e)
      setError(e.response?.data?.error || 'Connexion impossible')
    }
    setLoading(false)
  }

  return (
    <div className="auth-container">
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
          <Logo size="large" variant="default" />
        </div>
        <p style={{ color: '#a7f3d0', fontSize: 14, margin: 0 }}>Bienvenue de retour</p>
      </div>
      
      <div className="auth-card">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 16 }}>
          <button 
            className="btn btn-primary" 
            style={{ padding: 12, width: '100%' }}
          >
            Connexion
          </button>
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
            onClick={() => navigate('/signup')}
          >
            Inscription
          </button>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email ou nom d'utilisateur</label>
            <input 
              type="text" 
              placeholder="email@example.com ou username" 
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
          
          <div style={{ textAlign: 'right', fontSize: 12, color: '#94a3b8', marginBottom: 14 }}>
            Mot de passe oublié ?
          </div>
          
          <button type="submit" disabled={loading} style={{ width: '100%' }}>
            {loading ? 'Connexion…' : 'Se connecter →'}
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
