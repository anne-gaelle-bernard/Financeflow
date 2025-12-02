import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchTransactions, createTransaction } from '../services/api'

export default function Transactions() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [items, setItems] = useState([])
  const [sort, setSort] = useState('date_desc')
  const [form, setForm] = useState({ title: '', amount: '', location: '', description: '' })

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('ff_token') : null
    if (!token) {
      navigate('/login', { replace: true })
      return
    }
    let mounted = true
    async function load() {
      try {
        const res = await fetchTransactions({ sort })
        if (!mounted) return
        setItems(Array.isArray(res?.data) ? res.data : [])
        setLoading(false)
      } catch (e) {
        if (!mounted) return
        setError('Impossible de charger les transactions')
        setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [sort])

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    try {
      const payload = {
        title: form.title.trim(),
        amount: Number(form.amount),
        location: form.location.trim(),
        description: form.description.trim() || undefined
      }
      const res = await createTransaction(payload)
      const created = res?.data
      if (created) {
        setItems(prev => [created, ...prev])
        setForm({ title: '', amount: '', location: '', description: '' })
      }
    } catch (e) {
      setError('Création impossible. Vérifiez les champs.')
    }
  }

  return (
    <div style={{ padding: '16px', maxWidth: 800, margin: '0 auto' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ margin: 0 }}>Transactions</h1>
        <button onClick={() => navigate('/')} style={{ padding: '8px 12px' }}>Accueil</button>
      </header>

      <div style={{ marginTop: 16 }}>
        <section style={{ background: '#fff', padding: 12, borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
          <h2 style={{ marginTop: 0, fontSize: 18 }}>Nouvelle transaction</h2>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 8, gridTemplateColumns: '1fr 1fr' }}>
            <input name="title" value={form.title} onChange={handleChange} placeholder="Titre" required />
            <input name="amount" value={form.amount} onChange={handleChange} placeholder="Montant" type="number" step="0.01" required />
            <input name="location" value={form.location} onChange={handleChange} placeholder="Lieu" required />
            <input name="description" value={form.description} onChange={handleChange} placeholder="Description (optionnel)" />
            <div style={{ display: 'flex', gap: 8 }}>
              <button type="submit" style={{ padding: '8px 12px' }}>Ajouter</button>
              <select value={sort} onChange={e => setSort(e.target.value)} style={{ padding: '8px 12px' }}>
                <option value="date_desc">Date desc</option>
                <option value="date_asc">Date asc</option>
                <option value="amount_desc">Montant desc</option>
                <option value="amount_asc">Montant asc</option>
                <option value="title_asc">Titre A→Z</option>
                <option value="title_desc">Titre Z→A</option>
              </select>
            </div>
          </form>
        </section>
        {loading && <p>Chargement…</p>}
        {error && <p style={{ color: 'crimson' }}>{error}</p>}

        {!loading && !error && (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {items.map(tx => (
              <li key={tx._id || tx.id}
                  style={{
                    background: '#fff',
                    marginBottom: 12,
                    borderRadius: 8,
                    padding: 12,
                    boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
                  }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontWeight: 600 }}>{tx.title || tx.description || 'Transaction'}</div>
                    <div style={{ fontSize: 12, color: 'var(--muted)' }}>{tx.location || '—'}</div>
                  </div>
                  <div style={{ fontWeight: 700, color: (tx.amount < 0 ? '#E53E3E' : '#38A169') }}>
                    {typeof tx.amount === 'number' ? `${tx.amount.toFixed(2)} €` : tx.amount}
                  </div>
                </div>
              </li>
            ))}
            {items.length === 0 && (
              <li style={{ color: 'var(--muted)' }}>Aucune transaction pour le moment.</li>
            )}
          </ul>
        )}
      </div>
    </div>
  )
}
