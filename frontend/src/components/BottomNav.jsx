import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

export default function BottomNav() {
  const navigate = useNavigate()
  const location = useLocation()
  const items = [
    { label: 'Dashboard', path: '/' },
    { label: 'Transactions', path: '/transactions' },
    { label: 'Budgets', path: '/budgets' },
    { label: 'Reports', path: '/reports' },
    { label: 'Settings', path: '/settings' }
  ]

  return (
    <div className="bottom-nav">
      {items.map(item => (
        <button
          key={item.path}
          className={`bottom-nav-item ${location.pathname === item.path ? 'active' : ''}`}
          onClick={() => navigate(item.path)}
        >
          <span className="bottom-nav-icon">⬢</span>
          <span className="bottom-nav-label">{item.label}</span>
        </button>
      ))}
    </div>
  )
}

