import React from 'react'

export default function Home({ onNavigate }) {
  return (
    <div style={{ padding: '16px', maxWidth: 800, margin: '0 auto' }}>
      <h1 style={{ marginTop: 0 }}>FinanceFlow</h1>
      <p style={{ color: 'var(--muted)' }}>
        Gérez vos finances, suivez vos transactions et visualisez vos dépenses.
      </p>

      <div style={{ display: 'grid', gap: 8, gridTemplateColumns: '1fr 1fr' }}>
        <button onClick={() => onNavigate('transactions')} style={{ padding: '10px 12px' }}>Transactions</button>
        <button onClick={() => onNavigate('login')} style={{ padding: '10px 12px' }}>Connexion</button>
        <button onClick={() => onNavigate('signup')} style={{ padding: '10px 12px' }}>Inscription</button>
      </div>
    </div>
  )
<<<<<<< HEAD
}
=======
}
>>>>>>> 7a2e344 (Enforce inscription puis login avant accès; protège /api/transactions avec JWT; redirections frontend)
