import React, { useEffect, useMemo, useState } from 'react'
import { getReportsByUser, getTransactionsByUser, getBudgetsByUser, getSavingsByUser, createSavings, deleteSavings } from '../services/api'
import { useNavigate } from 'react-router-dom'
import BottomNav from '../components/BottomNav'
import '../styles/main.css'

export default function Home() {
  const navigate = useNavigate()
  const [isAuth, setIsAuth] = useState(() => (typeof window !== 'undefined' ? !!localStorage.getItem('ff_token') : false))
  const [user, setUser] = useState(() => {
    try {
      const raw = typeof window !== 'undefined' ? localStorage.getItem('ff_user') : null
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  })
  
  const [reports, setReports] = useState([])
  const [transactions, setTransactions] = useState([])
  const [budgets, setBudgets] = useState([])
  const [savings, setSavings] = useState([])
  const [loading, setLoading] = useState(false)
  const [showSavingsModal, setShowSavingsModal] = useState(false)
  const [savingsForm, setSavingsForm] = useState({
    amount: '',
    description: '',
    goal: ''
  })

  const currentMonth = new Date().toLocaleString('default', { month: 'long' })
  const currentYear = new Date().getFullYear()

  const stats = useMemo(() => {
    const currentReport = reports.find(r => r.month === currentMonth && r.year === currentYear)
    const monthTransactions = transactions.filter(tx => {
      const txDate = new Date(tx.date)
      return txDate.getMonth() === new Date().getMonth() && txDate.getFullYear() === currentYear
    })

    const income = monthTransactions
      .filter(tx => tx.type === 'income')
      .reduce((sum, tx) => sum + tx.amount, 0)
    
    const expense = monthTransactions
      .filter(tx => tx.type === 'expense')
      .reduce((sum, tx) => sum + tx.amount, 0)

    const totalSavings = savings.reduce((sum, s) => sum + s.amount, 0)

    return {
      income: currentReport?.totalIncome || income,
      expense: currentReport?.totalExpense || expense,
      balance: (currentReport?.balance) || (income - expense),
      transactions: monthTransactions.length,
      budgets: budgets.length,
      savings: totalSavings
    }
  }, [reports, transactions, budgets, savings, currentMonth, currentYear])

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('ff_token') : null
    if (!token) {
      setIsAuth(false)
      navigate('/login', { replace: true })
    } else {
      setIsAuth(true)
    }
  }, [navigate])

  useEffect(() => {
    async function load() {
      if (!user?.userId) return
      setLoading(true)
      try {
        const [repRes, txRes, budRes, savRes] = await Promise.all([
          getReportsByUser(user.userId).catch(() => []),
          getTransactionsByUser(user.userId).catch(() => []),
          getBudgetsByUser(user.userId).catch(() => []),
          getSavingsByUser(user.userId).catch(() => [])
        ])
        setReports(Array.isArray(repRes) ? repRes : [])
        setTransactions(Array.isArray(txRes) ? txRes : [])
        setBudgets(Array.isArray(budRes) ? budRes : [])
        setSavings(Array.isArray(savRes) ? savRes : [])
      } catch (err) {
        console.error('Error loading home data:', err)
      }
      setLoading(false)
    }
    if (isAuth) load()
  }, [isAuth, user?.userId])

  const handleSavingsSubmit = async (e) => {
    e.preventDefault()
    try {
      await createSavings({
        userId: user.userId,
        amount: Number(savingsForm.amount),
        description: savingsForm.description,
        goal: savingsForm.goal,
        date: new Date()
      })
      setSavingsForm({ amount: '', description: '', goal: '' })
      setShowSavingsModal(false)
      // Reload savings
      const savRes = await getSavingsByUser(user.userId)
      setSavings(Array.isArray(savRes) ? savRes : [])
    } catch (err) {
      console.error('Error saving:', err)
    }
  }

  const handleDeleteSavings = async (id) => {
    if (window.confirm('Supprimer cette épargne ?')) {
      try {
        await deleteSavings(id)
        const savRes = await getSavingsByUser(user.userId)
        setSavings(Array.isArray(savRes) ? savRes : [])
      } catch (err) {
        console.error('Error deleting savings:', err)
      }
    }
  }

  const navigateTo = (path) => {
    navigate(path)
  }

  return (
    <div className="main-layout">
      <div className="content">
        <div className="home-header">
          <div className="circle-icon">👤</div>
          <div>
            <div className="home-welcome">Bienvenue {user?.firstName || user?.username || 'Utilisateur'}</div>
            <div className="home-balance">Total Balance: ${stats.balance.toFixed(2)}</div>
          </div>
        </div>

        {loading ? (
          <div style={{ color: '#a7f3d0' }}>Loading...</div>
        ) : (
          <>
            <div className="dashboard-cards">
              <div className="dashboard-card">
                <div className="dashboard-card-title">Revenus</div>
                <div className="dashboard-card-value text-success">${stats.income.toFixed(2)}</div>
              </div>
              <div className="dashboard-card">
                <div className="dashboard-card-title">Dépenses</div>
                <div className="dashboard-card-value text-danger">${stats.expense.toFixed(2)}</div>
              </div>
              <div className="dashboard-card">
                <div className="dashboard-card-title">Solde</div>
                <div className="dashboard-card-value text-info">${stats.balance.toFixed(2)}</div>
              </div>
              <div className="dashboard-card" style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                <div className="dashboard-card-title">💰 Épargne Total</div>
                <div className="dashboard-card-value" style={{ color: '#10b981' }}>${stats.savings.toFixed(2)}</div>
              </div>
            </div>

            <div className="circle-actions">
              <div className="circle-action" onClick={() => navigate('/transactions?new=1')}>
                <div className="circle-icon">＋</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, color: '#e8fff6' }}>Nouvelle transaction</div>
                  <div style={{ fontSize: 12, color: '#a7f3d0' }}>Ajouter un revenu ou dépense</div>
                </div>
              </div>
              <div className="circle-action" onClick={() => setShowSavingsModal(true)} style={{ cursor: 'pointer' }}>
                <div className="circle-icon" style={{ background: 'linear-gradient(135deg, #22d3ee, #10b981)', color: '#04221d' }}>💰</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, color: '#e8fff6' }}>Enregistrer épargne</div>
                  <div style={{ fontSize: 12, color: '#a7f3d0' }}>Combien avez-vous économisé ?</div>
                </div>
              </div>
            </div>

            {/* Savings List */}
            {savings.length > 0 && (
              <div className="table-container" style={{ marginTop: 20 }}>
                <h3 style={{ color: '#e8fff6', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span>💰</span> Historique d'épargne
                </h3>
                <div style={{ display: 'grid', gap: 10 }}>
                  {savings.slice(0, 5).map(saving => (
                    <div key={saving._id} style={{
                      background: 'rgba(16, 185, 129, 0.08)',
                      border: '1px solid rgba(16, 185, 129, 0.2)',
                      borderRadius: 10,
                      padding: 12,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 18, fontWeight: 700, color: '#10b981' }}>
                          ${saving.amount.toFixed(2)}
                        </div>
                        <div style={{ fontSize: 13, color: '#a7f3d0', marginTop: 2 }}>
                          {saving.description || 'Épargne'}
                        </div>
                        {saving.goal && (
                          <div style={{ fontSize: 11, color: '#7dd3fc', marginTop: 2 }}>
                            🎯 {saving.goal}
                          </div>
                        )}
                        <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>
                          {new Date(saving.date).toLocaleDateString('fr-FR')}
                        </div>
                      </div>
                      <button 
                        className="btn btn-danger btn-small"
                        onClick={() => handleDeleteSavings(saving._id)}
                      >
                        Supprimer
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Savings Modal */}
        <div className={`modal ${showSavingsModal ? 'show' : ''}`} onClick={() => setShowSavingsModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>💰 Enregistrer une épargne</h2>
              <button className="close-btn" onClick={() => setShowSavingsModal(false)}>×</button>
            </div>
            <form onSubmit={handleSavingsSubmit}>
              <div className="form-group">
                <label>Montant épargné ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={savingsForm.amount}
                  onChange={(e) => setSavingsForm({ ...savingsForm, amount: e.target.value })}
                  placeholder="100.00"
                  required
                />
              </div>
              <div className="form-group">
                <label>Description (optionnel)</label>
                <input
                  type="text"
                  value={savingsForm.description}
                  onChange={(e) => setSavingsForm({ ...savingsForm, description: e.target.value })}
                  placeholder="Ex: Économies du mois"
                />
              </div>
              <div className="form-group">
                <label>Objectif (optionnel)</label>
                <input
                  type="text"
                  value={savingsForm.goal}
                  onChange={(e) => setSavingsForm({ ...savingsForm, goal: e.target.value })}
                  placeholder="Ex: Vacances d'été"
                />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                💾 Enregistrer
              </button>
            </form>
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  )
}

