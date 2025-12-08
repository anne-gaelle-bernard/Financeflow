import React, { useEffect, useMemo, useState } from 'react'
import { getReportsByUser, getTransactionsByUser, getBudgetsByUser } from '../services/api'
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
  const [loading, setLoading] = useState(false)

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

    return {
      income: currentReport?.totalIncome || income,
      expense: currentReport?.totalExpense || expense,
      balance: (currentReport?.balance) || (income - expense),
      transactions: monthTransactions.length,
      budgets: budgets.length
    }
  }, [reports, transactions, budgets, currentMonth, currentYear])

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
        const [repRes, txRes, budRes] = await Promise.all([
          getReportsByUser(user.userId).catch(() => []),
          getTransactionsByUser(user.userId).catch(() => []),
          getBudgetsByUser(user.userId).catch(() => [])
        ])
        setReports(Array.isArray(repRes) ? repRes : [])
        setTransactions(Array.isArray(txRes) ? txRes : [])
        setBudgets(Array.isArray(budRes) ? budRes : [])
      } catch (err) {
        console.error('Error loading home data:', err)
      }
      setLoading(false)
    }
    if (isAuth) load()
  }, [isAuth, user?.userId])

  const navigateTo = (path) => {
    navigate(path)
  }

  return (
    <div className="main-layout">
      <div className="content">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <div className="circle-icon">👤</div>
          <div>
            <div style={{ color: '#e8fff6', fontWeight: 800 }}>Bienvenue {user?.firstName || user?.username || 'Utilisateur'}</div>
            <div style={{ color: '#a7f3d0', fontSize: 13 }}>Total Balance: ${stats.balance.toFixed(2)}</div>
          </div>
        </div>

        {loading ? (
          <div style={{ color: '#a7f3d0' }}>Loading...</div>
        ) : (
          <>
            <div className="dashboard-cards">
              <div className="dashboard-card">
                <div className="dashboard-card-title">Income</div>
                <div className="dashboard-card-value" style={{ color: '#86efac' }}>${stats.income.toFixed(2)}</div>
              </div>
              <div className="dashboard-card">
                <div className="dashboard-card-title">Expenses</div>
                <div className="dashboard-card-value" style={{ color: '#fecaca' }}>${stats.expense.toFixed(2)}</div>
              </div>
              <div className="dashboard-card">
                <div className="dashboard-card-title">Saving</div>
                <div className="dashboard-card-value" style={{ color: '#22d3ee' }}>${Math.max(0, stats.balance).toFixed(2)}</div>
              </div>
            </div>

            <div className="circle-actions" style={{ marginBottom: 24 }}>
              <div className="circle-action">
                <div className="circle-icon">＋</div>
                <button className="btn" onClick={() => navigate('/transactions?new=1')}>Add New Transaction</button>
              </div>
              <div className="circle-action">
                <div className="circle-icon">↑</div>
                <button className="btn" onClick={() => navigate('/transactions?new=1&type=income')}>Income</button>
              </div>
              <div className="circle-action">
                <div className="circle-icon">↓</div>
                <button className="btn" onClick={() => navigate('/transactions?new=1&type=expense')}>Expense</button>
              </div>
            </div>
          </>
        )}
      </div>
      <BottomNav />
    </div>
  )
}

