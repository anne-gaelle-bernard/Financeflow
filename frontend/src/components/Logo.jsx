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
OF        borderRadius: '22%',
        background: 'linear-gradient(135deg, #2563eb 0%, #06b6d4 50%, #10b981 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        flexShrink: 0,
        boxShadow: '0 8px 24px rgba(37, 99, 235, 0.35), 0 2px 6px rgba(16, 185, 129, 0.2)'
      }}>
        <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Cercle décoratif en arrière-plan */}
          <circle cx="50" cy="50" r="42" fill="white" opacity="0.15"/>
          <circle cx="50" cy="50" r="35" fill="white" opacity="0.1"/>
          
          {/* Flèche montante (succès) */}
          <path d="M 25 55 Q 35 40, 50 35 Q 65 40, 75 25" 
                stroke="white" 
                strokeWidth="4.5" 
                fill="none" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                opacity="0.95"/>
          <path d="M 75 25 L 70 32 L 68 25 L 75 23 Z" fill="white" opacity="0.95"/>
          
          {/* Symbole € moderne */}
          <circle cx="50" cy="53" r="18" fill="white" opacity="0.25"/>
          <text x="50" y="63" 
                fontSize="32" 
                fontWeight="900" 
                fill="white" 
                textAnchor="middle" 
                fontFamily="system-ui, -apple-system, sans-serif"
                style={{ textShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>
            €
          </text>
          
          {/* Points décoratifs */}
          <circle cx="28" cy="68" r="3" fill="white" opacity="0.5"/>
          <circle cx="72" cy="68" r="3" fill="white" opacity="0.5"/>
          <circle cx="50" cy="22" r="2.5" fill="white" opacity="0.6"/>
        </svg>
      </div>
      {variant !== 'icon-only' && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2
        }}>
          <div style={{
            fontWeight: 800,
            fontSize: style.fontSize,
            lineHeight: 1,
            letterSpacing: '-0.5px'
          }}>
            <span style={{ color: '#1e40af' }}>Finance</span>
            <span style={{ color: '#4ade80' }}>Flow</span>
          </div>
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
