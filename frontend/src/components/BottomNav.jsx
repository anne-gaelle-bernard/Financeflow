import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

export default function BottomNav() {
  const navigate = useNavigate()
  const location = useLocation()
  const items = [
    { label: 'Accueil', path: '/', icon: '🏠' },
    { label: 'Transactions', path: '/transactions', icon: '💳' },
    { label: 'Budgets', path: '/budgets', icon: '🎯' },
    { label: 'Rapports', path: '/reports', icon: '📊' },
    { label: 'Paramètres', path: '/settings', icon: '⚙️' }
  ]

  return (
    <div className="bottom-nav">
      {items.map(item => (
        <button
          key={item.path}
          className={`bottom-nav-item ${location.pathname === item.path ? 'active' : ''}`}
          onClick={() => navigate(item.path)}
        >
          <span className="bottom-nav-icon">{item.icon}</span>
          <span className="bottom-nav-label">{item.label}</span>
        </button>
      ))}
    </div>
  )
}

