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
  const [showCalculator, setShowCalculator] = useState(false)
  const [showNotes, setShowNotes] = useState(false)
  const [calcDisplay, setCalcDisplay] = useState('0')
  const [calcInput, setCalcInput] = useState('')
  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem('ff_notes')
    return saved ? JSON.parse(saved) : []
  })
  const [noteText, setNoteText] = useState('')
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
          getSavingsByUser(user.userId).catch(err => {
            console.log('Error loading savings:', err)
            return []
          })
        ])
        setReports(Array.isArray(repRes) ? repRes : [])
        setTransactions(Array.isArray(txRes) ? txRes : [])
        setBudgets(Array.isArray(budRes) ? budRes : [])
        setSavings(Array.isArray(savRes) ? savRes : [])
        console.log('Savings loaded:', savRes)
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
      const result = await createSavings({
        userId: user.userId,
        amount: Number(savingsForm.amount),
        description: savingsForm.description,
        goal: savingsForm.goal,
        date: new Date()
      })
      console.log('Savings created:', result)
      setSavingsForm({ amount: '', description: '', goal: '' })
      setShowSavingsModal(false)
      // Reload savings
      const savRes = await getSavingsByUser(user.userId)
      console.log('Reloaded savings:', savRes)
      setSavings(Array.isArray(savRes) ? savRes : [])
    } catch (err) {
      console.error('Error saving:', err)
      alert('Erreur lors de l\'enregistrement: ' + (err.response?.data?.error || err.message))
    }
  }

  const handleDeleteSavings = async (id) => {
    if (window.confirm('Supprimer cette épargne ?')) {
      try {
        await deleteSavings(id)
        console.log('Savings deleted:', id)
        const savRes = await getSavingsByUser(user.userId)
        console.log('Reloaded savings after delete:', savRes)
        setSavings(Array.isArray(savRes) ? savRes : [])
      } catch (err) {
        console.error('Error deleting savings:', err)
        alert('Erreur lors de la suppression: ' + (err.response?.data?.error || err.message))
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
            <div className="home-balance">Total Balance: €{stats.balance.toFixed(2)}</div>
          </div>
        </div>

        {loading ? (
          <div className="text-emerald-300">Loading...</div>
        ) : (
          <>
            <div className="dashboard-cards">
              <div className="dashboard-card">
                <div className="dashboard-card-title">Revenus</div>
                <div className="dashboard-card-value text-success">€{stats.income.toFixed(2)}</div>
              </div>
              <div className="dashboard-card">
                <div className="dashboard-card-title">Dépenses</div>
                <div className="dashboard-card-value text-danger">€{stats.expense.toFixed(2)}</div>
              </div>
              <div className="dashboard-card">
                <div className="dashboard-card-title">Solde</div>
                <div className="dashboard-card-value text-info">€{stats.balance.toFixed(2)}</div>
              </div>
              <div className="dashboard-card" style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                <div className="dashboard-card-title">💰 Épargne Total</div>
                <div className="dashboard-card-value" style={{ color: '#10b981' }}>€{stats.savings.toFixed(2)}</div>
              </div>
            </div>

            <div className="circle-actions" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 12 }}>
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
              <div className="circle-action" onClick={() => setShowCalculator(true)} style={{ cursor: 'pointer' }}>
                <div className="circle-icon" style={{ background: 'linear-gradient(135deg, #8b5cf6, #ec4899)', color: '#fff' }}>🔢</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, color: '#e8fff6' }}>Calculatrice</div>
                  <div style={{ fontSize: 12, color: '#a7f3d0' }}>Calculer vos finances</div>
                </div>
              </div>
              <div className="circle-action" onClick={() => setShowNotes(true)} style={{ cursor: 'pointer' }}>
                <div className="circle-icon" style={{ background: 'linear-gradient(135deg, #f59e0b, #f97316)', color: '#fff' }}>📝</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, color: '#e8fff6' }}>Notes rapides</div>
                  <div style={{ fontSize: 12, color: '#a7f3d0' }}>Gérer vos notes</div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Calculator Modal */}
        <div className={`modal ${showCalculator ? 'show' : ''}`} onClick={() => setShowCalculator(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: 400 }}>
            <div className="modal-header">
              <h2>🔢 Calculatrice</h2>
              <button className="close-btn" onClick={() => setShowCalculator(false)}>×</button>
            </div>
            <div style={{ padding: '0 20px 20px' }}>
              <div style={{ 
                background: '#0a3a33', 
                padding: 20, 
                borderRadius: 12, 
                marginBottom: 16,
                textAlign: 'right',
                fontSize: 32,
                fontWeight: 700,
                color: '#22d3ee',
                minHeight: 60,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                border: '2px solid rgba(34, 211, 238, 0.3)'
              }}>
                {calcDisplay}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
                {['7','8','9','/','4','5','6','*','1','2','3','-','0','.','=','+'].map(btn => (
                  <button
                    key={btn}
                    onClick={() => {
                      if (btn === '=') {
                        try {
                          const result = eval(calcInput || '0')
                          setCalcDisplay(result.toString())
                          setCalcInput(result.toString())
                        } catch {
                          setCalcDisplay('Erreur')
                        }
                      } else {
                        const newInput = calcInput === '0' ? btn : calcInput + btn
                        setCalcInput(newInput)
                        setCalcDisplay(newInput)
                      }
                    }}
                    style={{
                      padding: 20,
                      fontSize: 20,
                      fontWeight: 600,
                      borderRadius: 12,
                      border: 'none',
                      background: btn === '=' ? 'linear-gradient(135deg, #22d3ee, #10b981)' : 'rgba(34, 211, 238, 0.1)',
                      color: '#e8fff6',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    {btn}
                  </button>
                ))}
                <button
                  onClick={() => {
                    setCalcInput('0')
                    setCalcDisplay('0')
                  }}
                  style={{
                    padding: 20,
                    fontSize: 16,
                    fontWeight: 600,
                    borderRadius: 12,
                    border: 'none',
                    background: 'rgba(239, 68, 68, 0.2)',
                    color: '#fecaca',
                    cursor: 'pointer',
                    gridColumn: 'span 4'
                  }}
                >
                  Effacer
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Notes Modal */}
        <div className={`modal ${showNotes ? 'show' : ''}`} onClick={() => setShowNotes(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: 600 }}>
            <div className="modal-header">
              <h2>📝 Notes rapides</h2>
              <button className="close-btn" onClick={() => setShowNotes(false)}>×</button>
            </div>
            <div style={{ padding: '0 20px 20px' }}>
              <div style={{ marginBottom: 20 }}>
                <textarea
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="Écrivez votre note ici..."
                  style={{
                    width: '100%',
                    minHeight: 100,
                    padding: 12,
                    borderRadius: 10,
                    background: '#0a3a33',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#e8fff6',
                    fontSize: 14,
                    fontFamily: 'inherit',
                    resize: 'vertical'
                  }}
                />
                <button
                  onClick={() => {
                    if (noteText.trim()) {
                      const newNotes = [...notes, { id: Date.now(), text: noteText, date: new Date().toISOString() }]
                      setNotes(newNotes)
                      localStorage.setItem('ff_notes', JSON.stringify(newNotes))
                      setNoteText('')
                    }
                  }}
                  className="btn btn-primary"
                  style={{ width: '100%', marginTop: 10 }}
                >
                  Ajouter la note
                </button>
              </div>
              <div style={{ maxHeight: 300, overflowY: 'auto' }}>
                {notes.length === 0 ? (
                  <div style={{ textAlign: 'center', color: '#a7f3d0', padding: 20 }}>
                    Aucune note pour le moment
                  </div>
                ) : (
                  notes.slice().reverse().map(note => (
                    <div
                      key={note.id}
                      style={{
                        background: 'rgba(34, 211, 238, 0.1)',
                        padding: 12,
                        borderRadius: 10,
                        marginBottom: 10,
                        border: '1px solid rgba(34, 211, 238, 0.2)'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: 10 }}>
                        <div style={{ flex: 1, color: '#e8fff6', fontSize: 14 }}>{note.text}</div>
                        <button
                          onClick={() => {
                            const newNotes = notes.filter(n => n.id !== note.id)
                            setNotes(newNotes)
                            localStorage.setItem('ff_notes', JSON.stringify(newNotes))
                          }}
                          style={{
                            background: 'rgba(239, 68, 68, 0.2)',
                            border: 'none',
                            color: '#fecaca',
                            padding: '4px 8px',
                            borderRadius: 6,
                            cursor: 'pointer',
                            fontSize: 12
                          }}
                        >
                          ×
                        </button>
                      </div>
                      <div style={{ fontSize: 11, color: '#a7f3d0', marginTop: 6 }}>
                        {new Date(note.date).toLocaleString('fr-FR')}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Savings Modal */}
        <div className={`modal ${showSavingsModal ? 'show' : ''}`} onClick={() => setShowSavingsModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>💰 Enregistrer une épargne</h2>
              <button className="close-btn" onClick={() => setShowSavingsModal(false)}>×</button>
            </div>
            <form onSubmit={handleSavingsSubmit}>
              <div className="form-group">
                <label>Montant épargné (€)</label>
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

