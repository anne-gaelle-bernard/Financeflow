import React, { useState } from 'react'
import { updateUser, deleteUser, setAuthToken } from '../services/api'
import { useNavigate } from 'react-router-dom'
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
      setMessage('Profile updated successfully!')
      setFormData({ username: '', email: '', password: '' })
      setTimeout(() => setMessage(''), 3000)
    } catch (err) {
      setMessage('Error updating profile')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('ff_token')
    localStorage.removeItem('ff_user')
    setAuthToken(null)
    navigate('/login')
  }

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure? This action cannot be undone.')) {
      try {
        deleteUser(user.userId)
        handleLogout()
      } catch (err) {
        setMessage('Error deleting account')
      }
    }
  }

  return (
    <div className="main-layout">
      <div className="content">
        <h1 style={{ color: '#e8fff6', marginBottom: 20 }}>Settings</h1>

        <div className="table-container" style={{ maxWidth: 600 }}>
          <h2 style={{ color: '#a7f3d0', marginTop: 0 }}>Update Profile</h2>
          
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
              <label>Current Username</label>
              <input type="text" disabled value={user.username || ''} style={{ opacity: 0.6 }} />
            </div>

            <div className="form-group">
              <label>New Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Leave empty to keep current"
              />
            </div>

            <div className="form-group">
              <label>Current Email</label>
              <input type="text" disabled value={user.email || ''} style={{ opacity: 0.6 }} />
            </div>

            <div className="form-group">
              <label>New Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Leave empty to keep current"
              />
            </div>

            <div className="form-group">
              <label>New Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Leave empty to keep current"
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
                {showPassword ? 'Hide' : 'Show'} password
              </button>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              Update Profile
            </button>
          </form>
        </div>

        <div className="table-container" style={{ maxWidth: 600, marginTop: 20 }}>
          <h2 style={{ color: '#a7f3d0', marginTop: 0 }}>Account Actions</h2>
          <div style={{ display: 'grid', gap: 12 }}>
            <button
              className="btn btn-primary"
              style={{ width: '100%' }}
              onClick={handleLogout}
            >
              Logout
            </button>
            <button
              className="btn btn-danger"
              style={{ width: '100%' }}
              onClick={handleDeleteAccount}
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
