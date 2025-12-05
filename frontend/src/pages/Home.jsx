import React, { useEffect, useMemo, useState } from 'react'
import { getReportsByUser, getTransactionsByUser, getBudgetsByUser } from '../services/api'
import { useNavigate } from 'react-router-dom'
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
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ color: '#e8fff6', margin: '0 0 8px 0' }}>
            Welcome, {user?.username || 'User'}!
          </h1>
          <p style={{ color: '#a7f3d0', margin: 0 }}>
            {currentMonth} {currentYear}
          </p>
        </div>

        {loading ? (
          <div style={{ color: '#a7f3d0' }}>Loading...</div>
        ) : (
          <>
            {/* Stats Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
              <div className="table-container" style={{ marginBottom: 0 }}>
                <div style={{ color: '#a7f3d0', fontSize: 12, marginBottom: 8 }}>BALANCE</div>
                <div style={{
                  fontSize: 32,
                  fontWeight: 800,
                  color: stats.balance >= 0 ? '#86efac' : '#fecaca'
                }}>
                  ${stats.balance.toFixed(2)}
                </div>
              </div>

              <div className="table-container" style={{ marginBottom: 0 }}>
                <div style={{ color: '#a7f3d0', fontSize: 12, marginBottom: 8 }}>INCOME</div>
                <div style={{ fontSize: 32, fontWeight: 800, color: '#86efac' }}>
                  ${stats.income.toFixed(2)}
                </div>
              </div>

              <div className="table-container" style={{ marginBottom: 0 }}>
                <div style={{ color: '#a7f3d0', fontSize: 12, marginBottom: 8 }}>EXPENSES</div>
                <div style={{ fontSize: 32, fontWeight: 800, color: '#fecaca' }}>
                  ${stats.expense.toFixed(2)}
                </div>
              </div>

              <div className="table-container" style={{ marginBottom: 0 }}>
                <div style={{ color: '#a7f3d0', fontSize: 12, marginBottom: 8 }}>TRANSACTIONS</div>
                <div style={{ fontSize: 32, fontWeight: 800, color: '#22d3ee' }}>
                  {stats.transactions}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div style={{ marginBottom: 32 }}>
              <h2 style={{ color: '#e8fff6', marginBottom: 16 }}>Quick Actions</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12 }}>
                <button
                  className="btn btn-primary"
                  onClick={() => navigateTo('/transactions')}
                >
                  View Transactions
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => navigateTo('/budgets')}
                >
                  Manage Budgets
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => navigateTo('/reports')}
                >
                  View Reports
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => navigateTo('/settings')}
                >
                  Settings
                </button>
              </div>
            </div>

            {/* Recent Transactions */}
            {transactions.length > 0 && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <h2 style={{ color: '#e8fff6', margin: 0 }}>Recent Transactions</h2>
                  <button className="btn btn-small" onClick={() => navigateTo('/transactions')}>
                    See all
                  </button>
                </div>
                <div className="table-container">
                  <table>
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Category</th>
                        <th>Type</th>
                        <th>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.slice(0, 5).map(tx => (
                        <tr key={tx._id}>
                          <td>{new Date(tx.date).toLocaleDateString()}</td>
                          <td>{tx.categoryId?.name || 'N/A'}</td>
                          <td style={{ color: tx.type === 'income' ? '#86efac' : '#fecaca' }}>
                            {tx.type}
                          </td>
                          <td>${tx.amount.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

