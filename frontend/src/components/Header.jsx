import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { setAuthToken } from '../services/api'

export default function Header() {
  const navigate = useNavigate()
  const location = useLocation()
  const user = JSON.parse(localStorage.getItem('ff_user') || '{}')
  const [isMobile, setIsMobile] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth <= 768)
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

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
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr auto' : '1fr 1fr',
      alignItems: 'center',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <svg
            className="w-8 h-8"
            viewBox="0 0 64 64"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="grad1" x1="0" x2="1">
                <stop offset="0%" stopColor="#22d3ee" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
            </defs>

            <circle cx="32" cy="32" r="28" fill="url(#grad1)" opacity="0.15" />
            <rect x="18" y="30" width="6" height="14" rx="1.5" fill="url(#grad1)" />
            <rect x="28" y="22" width="6" height="22" rx="1.5" fill="url(#grad1)" />
            <rect x="38" y="16" width="6" height="28" rx="1.5" fill="url(#grad1)" />
            <path d="M16 34 C24 18, 40 18, 48 26" stroke="#22d3ee" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          </svg>

          <h1 style={{ color: '#22d3ee', margin: 0, fontSize: 24, fontWeight: 800 }}>
            FinanceFlow
          </h1>
        </div>

        {isMobile && (
          <button
            onClick={() => setMenuOpen(v => !v)}
            style={{ background: '#0b3a33', border: '1px solid rgba(255,255,255,0.08)', color: '#e8fff6', borderRadius: 8, padding: '8px 10px', cursor: 'pointer' }}
          >
            ☰
          </button>
        )}

        <nav style={{ display: isMobile ? (menuOpen ? 'flex' : 'none') : 'flex', gap: isMobile ? 8 : 16, flexDirection: isMobile ? 'column' : 'row' }}>
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

      <div style={{ display: 'flex', alignItems: 'center', gap: 16, justifyContent: 'flex-end' }}>
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
