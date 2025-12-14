import React, { useState, useEffect } from 'react'
import { getReportsByUser, createReport, updateReport, deleteReport, getTransactionsByUser } from '../services/api'
import BottomNav from '../components/BottomNav'
import '../styles/main.css'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js'
import { Bar, Line } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend
)

export default function Reports() {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    month: '',
    year: new Date().getFullYear(),
    totalIncome: 0,
    totalExpense: 0
  })

  const user = JSON.parse(localStorage.getItem('ff_user') || '{}')
  const userId = user?._id || user?.userId || null
  const months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre']

  useEffect(() => {
    loadReports()
  }, [])

  const loadReports = async () => {
    setLoading(true)
    try {
      const res = await getReportsByUser(userId)
      setReports(Array.isArray(res) ? res : [])
    } catch (err) {
      console.error('Error loading reports:', err)
    }
    setLoading(false)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const payload = {
        ...formData,
        userId: userId,
        totalIncome: Number(formData.totalIncome),
        totalExpense: Number(formData.totalExpense),
        year: Number(formData.year)
      }

      if (editingId) {
        await updateReport(editingId, payload)
      } else {
        await createReport(payload)
      }
      setFormData({ month: '', year: new Date().getFullYear(), totalIncome: 0, totalExpense: 0 })
      setEditingId(null)
      setShowModal(false)
      loadReports()
    } catch (err) {
      console.error('Error saving report:', err)
    }
  }

  const handleGenerateFromTransactions = async () => {
    try {
      const txs = await getTransactionsByUser(user.userId)
      const list = Array.isArray(txs) ? txs : []
      const monthIdx = months.indexOf(formData.month)
      if (monthIdx < 0) return
      const totalIncome = list
        .filter(tx => {
          const d = new Date(tx.date)
          return d.getMonth() === monthIdx && d.getFullYear() === Number(formData.year) && tx.type === 'income'
        })
        .reduce((s, tx) => s + (tx.amount || 0), 0)
      const totalExpense = list
        .filter(tx => {
          const d = new Date(tx.date)
          return d.getMonth() === monthIdx && d.getFullYear() === Number(formData.year) && tx.type === 'expense'
        })
        .reduce((s, tx) => s + (tx.amount || 0), 0)
      setFormData(prev => ({ ...prev, totalIncome, totalExpense }))
    } catch (e) {
      console.error('Generate report error:', e)
    }
  }

  const exportCsv = () => {
    const rows = [
      ['Month','Year','Income','Expense','Balance'],
      ...reports.map(r => [r.month, r.year, r.totalIncome, r.totalExpense, r.balance])
    ]
    const csv = rows.map(r => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'reports.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleEdit = (report) => {
    setFormData(report)
    setEditingId(report._id)
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await deleteReport(id)
        loadReports()
      } catch (err) {
        console.error('Error deleting:', err)
      }
    }
  }

  return (
    <div className="main-layout">
      <div className="content">
        <div className="page-header">
          <h1>📊 Rapports</h1>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            + Nouveau rapport
          </button>
        </div>

        {loading ? (
          <div className="text-emerald-300">Loading...</div>
        ) : (
          <>
          <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
            <button className="btn" style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.3)' }} onClick={exportCsv}>
              📥 Exporter CSV
            </button>
          </div>

          <div className="charts-grid">
            <div className="chart-card">
              <h3>Revenus vs Dépenses</h3>
                <Bar
                data={{
                  labels: reports.map(r => `${r.month} ${r.year}`),
                  datasets: [
                    { label: 'Income', data: reports.map(r => r.totalIncome), backgroundColor: '#10b981' },
                    { label: 'Expense', data: reports.map(r => r.totalExpense), backgroundColor: '#f97373' }
                  ]
                }}
                options={{ responsive: true, maintainAspectRatio: false }}
              />
            </div>
            <div className="chart-card">
              <h3>Solde au fil du temps</h3>
              <Line
                data={{
                  labels: reports.map(r => `${r.month} ${r.year}`),
                  datasets: [
                    { label: 'Balance', data: reports.map(r => r.balance), borderColor: '#22d3ee', backgroundColor: 'rgba(34,211,238,0.15)', tension: 0.2 }
                  ]
                }}
                options={{ responsive: true, maintainAspectRatio: false }}
              />
            </div>
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Mois</th>
                  <th>Année</th>
                  <th>Revenus</th>
                  <th>Dépenses</th>
                  <th>Solde</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {reports.map(report => (
                  <tr key={report._id}>
                    <td>{report.month}</td>
                    <td>{report.year}</td>
                    <td style={{ color: '#86efac' }}>€{report.totalIncome.toFixed(2)}</td>
                    <td style={{ color: '#fecaca' }}>€{report.totalExpense.toFixed(2)}</td>
                    <td style={{ color: report.balance >= 0 ? '#86efac' : '#fecaca' }}>
                      €{report.balance.toFixed(2)}
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button className="btn btn-small" onClick={() => handleEdit(report)}>
                          Modifier
                        </button>
                        <button className="btn btn-danger btn-small" onClick={() => handleDelete(report._id)}>
                          Supprimer
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          </>
        )}

        {/* Modal */}
        <div className={`modal ${showModal ? 'show' : ''}`} onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingId ? 'Modifier' : 'Nouveau'} Rapport</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Mois</label>
                <select name="month" value={formData.month} onChange={handleChange} required>
                  <option value="">Sélectionner un mois</option>
                  {months.map(month => (
                    <option key={month} value={month}>{month}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Année</label>
                <input type="number" name="year" value={formData.year} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Total Revenus</label>
                <input type="number" name="totalIncome" value={formData.totalIncome} onChange={handleChange} required step="0.01" />
              </div>
              <div className="form-group">
                <label>Total Dépenses</label>
                <input type="number" name="totalExpense" value={formData.totalExpense} onChange={handleChange} required step="0.01" />
              </div>
              <button type="button" className="btn" onClick={handleGenerateFromTransactions} style={{ width: '100%', marginBottom: 8 }}>
                Générer depuis les transactions
              </button>
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                Enregistrer
              </button>
            </form>
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  )
}
