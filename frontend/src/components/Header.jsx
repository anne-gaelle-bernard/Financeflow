import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { setAuthToken } from '../services/api'
import Logo from './Logo'

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
      padding: isMobile ? '12px 16px' : '16px 24px',
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr auto' : '1fr 1fr',
      alignItems: 'center',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      backdropFilter: 'blur(10px)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, justifyContent: 'space-between' }}>
        <div 
          onClick={() => navigate('/')}
          style={{ cursor: 'pointer' }}
        >
          <Logo size={isMobile ? 'small' : 'medium'} variant={isMobile ? 'icon-only' : 'default'} />
        </div>

        {isMobile && (
          <button
            onClick={() => setMenuOpen(v => !v)}
            style={{ 
              background: '#0b3a33', 
              border: '1px solid rgba(255,255,255,0.08)', 
              color: '#e8fff6', 
              borderRadius: 8, 
              padding: '10px 12px', 
              cursor: 'pointer',
              fontSize: 18,
              minWidth: 44,
              minHeight: 44,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        )}
      </div>

      {isMobile && menuOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          background: 'rgba(20, 44, 40, 0.98)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          backdropFilter: 'blur(10px)'
        }}>
          {navLinks.map(link => (
            <button
              key={link.path}
              onClick={() => {
                navigate(link.path)
                setMenuOpen(false)
              }}
              style={{
                background: isActive(link.path) ? 'rgba(16, 185, 129, 0.15)' : 'none',
                border: isActive(link.path) ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(255, 255, 255, 0.08)',
                color: isActive(link.path) ? '#22d3ee' : '#e8fff6',
                cursor: 'pointer',
                fontSize: 15,
                fontWeight: 600,
                padding: '12px 16px',
                borderRadius: 8,
                textAlign: 'left',
                minHeight: 44
              }}
            >
              {link.label}
            </button>
          ))}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 12,
            padding: '12px 16px',
            background: 'rgba(20, 44, 40, 0.5)',
            borderRadius: 8,
            border: '1px solid rgba(255, 255, 255, 0.08)'
          }}>
            <span style={{ color: '#a7f3d0', fontSize: 14, flex: 1 }}>
              {user.username}
            </span>
            <button
              onClick={() => {
                handleLogout()
                setMenuOpen(false)
              }}
              style={{
                padding: '8px 16px',
                borderRadius: 8,
                background: 'rgba(220, 38, 38, 0.2)',
                color: '#fecaca',
                border: 'none',
                cursor: 'pointer',
                fontSize: 14,
                fontWeight: 600,
                minHeight: 36
              }}
            >
              Logout
            </button>
          </div>
        </div>
      )}

      {!isMobile && (
        <>
          <nav style={{ 
            display: 'flex', 
            gap: 20, 
            justifyContent: 'center',
            gridColumn: 1
          }}>
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
                fontWeight: 600,
                minHeight: 36
              }}
            >
              Logout
            </button>
          </div>
        </>
      )}
    </header>
  )
}
