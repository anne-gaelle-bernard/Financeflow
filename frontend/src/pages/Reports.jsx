import React, { useState, useEffect } from 'react'
import { getReportsByUser, createReport, updateReport, deleteReport } from '../services/api'
import '../styles/main.css'

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
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

  useEffect(() => {
    loadReports()
  }, [])

  const loadReports = async () => {
    setLoading(true)
    try {
      const res = await getReportsByUser(user.userId)
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
        userId: user.userId,
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h1 style={{ color: '#e8fff6', margin: 0 }}>Reports</h1>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            + New Report
          </button>
        </div>

        {loading ? (
          <div style={{ color: '#a7f3d0' }}>Loading...</div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Month</th>
                  <th>Year</th>
                  <th>Income</th>
                  <th>Expense</th>
                  <th>Balance</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {reports.map(report => (
                  <tr key={report._id}>
                    <td>{report.month}</td>
                    <td>{report.year}</td>
                    <td style={{ color: '#86efac' }}>${report.totalIncome.toFixed(2)}</td>
                    <td style={{ color: '#fecaca' }}>${report.totalExpense.toFixed(2)}</td>
                    <td style={{ color: report.balance >= 0 ? '#86efac' : '#fecaca' }}>
                      ${report.balance.toFixed(2)}
                    </td>
                    <td>
                      <button className="btn btn-small" style={{ marginRight: 8 }} onClick={() => handleEdit(report)}>
                        Edit
                      </button>
                      <button className="btn btn-danger btn-small" onClick={() => handleDelete(report._id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal */}
        <div className={`modal ${showModal ? 'show' : ''}`} onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingId ? 'Edit' : 'New'} Report</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Month</label>
                <select name="month" value={formData.month} onChange={handleChange} required>
                  <option value="">Select Month</option>
                  {months.map(month => (
                    <option key={month} value={month}>{month}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Year</label>
                <input type="number" name="year" value={formData.year} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Total Income</label>
                <input type="number" name="totalIncome" value={formData.totalIncome} onChange={handleChange} required step="0.01" />
              </div>
              <div className="form-group">
                <label>Total Expense</label>
                <input type="number" name="totalExpense" value={formData.totalExpense} onChange={handleChange} required step="0.01" />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                Save
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
