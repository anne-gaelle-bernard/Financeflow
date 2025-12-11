import React from 'react'

export default function Logo({ size = 'medium', variant = 'default' }) {
  const sizes = {
    small: { width: 32, fontSize: 14 },
    medium: { width: 40, fontSize: 18 },
    large: { width: 56, fontSize: 24 }
  }
  
  const style = sizes[size] || sizes.medium
  
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: variant === 'icon-only' ? 0 : 10,
      textDecoration: 'none',
      color: '#e8fff6'
    }}>
      <div style={{
        width: style.width,
        height: style.width,
        borderRadius: '12px',
        background: 'linear-gradient(135deg, #22d3ee, #10b981)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: style.fontSize,
        fontWeight: 'bold',
        color: '#04221d',
        flexShrink: 0,
        boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)'
      }}>
        💰
      </div>
      {variant !== 'icon-only' && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2
        }}>
          <span style={{
            fontWeight: 800,
            fontSize: style.fontSize,
            color: '#e8fff6',
            lineHeight: 1,
            letterSpacing: '-0.5px'
          }}>
            FinanceFlow
          </span>
          <span style={{
            fontSize: Math.max(10, style.fontSize - 8),
            color: '#a7f3d0',
            lineHeight: 1,
            letterSpacing: '0.5px'
          }}>
            Gérez vos finances
          </span>
        </div>
      )}
    </div>
  )
}
