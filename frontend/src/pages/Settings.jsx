import React, { useState } from 'react'
import { updateUser, deleteUser, setAuthToken } from '../services/api'
import { useNavigate } from 'react-router-dom'
import BottomNav from '../components/BottomNav'
import '../styles/main.css'

export default function Settings() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [message, setMessage] = useState('')
  
  const user = JSON.parse(localStorage.getItem('ff_user') || '{}')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    try {
      const payload = {}
      if (formData.username) payload.username = formData.username
      if (formData.email) payload.email = formData.email
      if (formData.password) payload.password = formData.password

      const res = await updateUser(user.userId, payload)
      setMessage('Profil mis à jour avec succès !')
      setFormData({ username: '', email: '', password: '' })
      setTimeout(() => setMessage(''), 3000)
    } catch (err) {
      setMessage('Erreur lors de la mise à jour du profil')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('ff_token')
    localStorage.removeItem('ff_user')
    setAuthToken(null)
    navigate('/login')
  }

  const handleDeleteAccount = () => {
    if (window.confirm('Êtes-vous sûr ? Cette action est irréversible.')) {
      try {
        deleteUser(user.userId)
        handleLogout()
      } catch (err) {
        setMessage('Erreur lors de la suppression du compte')
      }
    }
  }

  return (
    <div className="main-layout">
      <div className="content">
        <div className="page-header">
          <h1>⚙️ Paramètres</h1>
        </div>

        <div className="table-container" style={{ maxWidth: 600 }}>
          <h2 style={{ color: '#a7f3d0', marginTop: 0, fontSize: 18 }}>Mettre à jour le profil</h2>
          
          {message && (
            <div style={{
              padding: 12,
              borderRadius: 8,
              marginBottom: 16,
              background: message.includes('Error') ? 'rgba(120, 0, 0, 0.2)' : 'rgba(16, 185, 129, 0.2)',
              color: message.includes('Error') ? '#fecaca' : '#86efac'
            }}>
              {message}
            </div>
          )}

          <form onSubmit={handleUpdateProfile} style={{ display: 'grid', gap: 16 }}>
            <div className="form-group">
              <label>Nom d'utilisateur actuel</label>
              <input type="text" disabled value={user.username || ''} style={{ opacity: 0.6 }} />
            </div>

            <div className="form-group">
              <label>Nouveau nom d'utilisateur</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Laisser vide pour conserver"
              />
            </div>

            <div className="form-group">
              <label>Email actuel</label>
              <input type="text" disabled value={user.email || ''} style={{ opacity: 0.6 }} />
            </div>

            <div className="form-group">
              <label>Nouvel email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Laisser vide pour conserver"
              />
            </div>

            <div className="form-group">
              <label>Nouveau mot de passe</label>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Laisser vide pour conserver"
              />
              <button
                type="button"
                style={{
                  marginTop: 8,
                  padding: 6,
                  fontSize: 12,
                  background: 'transparent',
                  color: '#a7f3d0',
                  border: 'none',
                  cursor: 'pointer'
                }}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? 'Masquer' : 'Afficher'} le mot de passe
              </button>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              Mettre à jour le profil
            </button>
          </form>
        </div>

        <div className="table-container" style={{ maxWidth: 600, marginTop: 20 }}>
          <h2 style={{ color: '#a7f3d0', marginTop: 0 }}>Actions du compte</h2>
          <div style={{ display: 'grid', gap: 12 }}>
            <button
              className="btn btn-primary"
              style={{ width: '100%' }}
              onClick={handleLogout}
            >
              Déconnexion
            </button>
            <button
              className="btn btn-danger"
              style={{ width: '100%' }}
              onClick={handleDeleteAccount}
            >
              Supprimer le compte
            </button>
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  )
}
