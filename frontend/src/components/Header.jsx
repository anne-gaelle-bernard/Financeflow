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
    { path: '/', label: 'Tableau de bord' },
    { path: '/transactions', label: 'Transactions' },
    { path: '/budgets', label: 'Budgets' },
    { path: '/reports', label: 'Rapports' },
    { path: '/settings', label: 'Paramètres' }
  ]

  return (
    <header style={{
      background: 'rgba(20, 44, 40, 0.5)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      padding: isMobile ? '12px 16px' : '16px 24px',
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
      alignItems: 'center',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      backdropFilter: 'blur(10px)',
      width: '100%'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, justifyContent: isMobile ? 'center' : 'flex-start' }}>
        <div 
          onClick={() => navigate('/')}
          style={{ cursor: 'pointer' }}
        >
          <Logo size={isMobile ? 'small' : 'medium'} variant={isMobile ? 'icon-only' : 'default'} />
        </div>
      </div>

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
