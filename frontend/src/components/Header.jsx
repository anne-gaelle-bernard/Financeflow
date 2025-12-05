import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { setAuthToken } from '../services/api'

export default function Header() {
  const navigate = useNavigate()
  const location = useLocation()
  const user = JSON.parse(localStorage.getItem('ff_user') || '{}')

  const isActive = (path) => location.pathname === path

  const handleLogout = () => {
    localStorage.removeItem('ff_token')
    localStorage.removeItem('ff_user')
    setAuthToken(null)
    navigate('/login')
  }

  const navLinks = [
    { path: '/', label: 'Dashboard' },
    { path: '/transactions', label: 'Transactions' },
    { path: '/budgets', label: 'Budgets' },
    { path: '/reports', label: 'Reports' },
    { path: '/settings', label: 'Settings' }
  ]

  return (
    <header style={{
      background: 'rgba(20, 44, 40, 0.5)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      padding: '16px 24px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
        <h1 style={{ color: '#22d3ee', margin: 0, fontSize: 24, fontWeight: 800 }}>
          FinanceFlow
        </h1>
        <nav style={{ display: 'flex', gap: 16 }}>
          {navLinks.map(link => (
            <button
              key={link.path}
              onClick={() => navigate(link.path)}
              style={{
                background: 'none',
                border: 'none',
                color: isActive(link.path) ? '#22d3ee' : '#a7f3d0',
                cursor: 'pointer',
                fontSize: 14,
                fontWeight: 600,
                padding: '8px 0',
                borderBottom: isActive(link.path) ? '2px solid #22d3ee' : 'none',
                transition: 'all 0.3s ease'
              }}
            >
              {link.label}
            </button>
          ))}
        </nav>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <span style={{ color: '#a7f3d0', fontSize: 14 }}>
          {user.username}
        </span>
        <button
          onClick={handleLogout}
          style={{
            padding: '8px 16px',
            borderRadius: 8,
            background: 'rgba(220, 38, 38, 0.2)',
            color: '#fecaca',
            border: 'none',
            cursor: 'pointer',
            fontSize: 14,
            fontWeight: 600
          }}
        >
          Logout
        </button>
      </div>
    </header>
  )
}
