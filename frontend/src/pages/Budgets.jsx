import React, { useState, useEffect } from 'react'
import { getBudgetsByUser, createBudget, updateBudget, deleteBudget, getCategoriesByUser } from '../services/api'
import '../styles/main.css'

export default function Budgets() {
  const [budgets, setBudgets] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    categoryId: '',
    amount: '',
    month: '',
    year: new Date().getFullYear()
  })

  const user = JSON.parse(localStorage.getItem('ff_user') || '{}')
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [budRes, catRes] = await Promise.all([
        getBudgetsByUser(user.userId),
        getCategoriesByUser(user.userId)
      ])
      setBudgets(Array.isArray(budRes) ? budRes : [])
      setCategories(Array.isArray(catRes) ? catRes : [])
    } catch (err) {
      console.error('Error loading data:', err)
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
        amount: Number(formData.amount),
        year: Number(formData.year)
      }

      if (editingId) {
        await updateBudget(editingId, payload)
      } else {
        await createBudget(payload)
      }
      setFormData({ categoryId: '', amount: '', month: '', year: new Date().getFullYear() })
      setEditingId(null)
      setShowModal(false)
      loadData()
    } catch (err) {
      console.error('Error saving budget:', err)
    }
  }

  const handleEdit = (budget) => {
    setFormData(budget)
    setEditingId(budget._id)
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await deleteBudget(id)
        loadData()
      } catch (err) {
        console.error('Error deleting:', err)
      }
    }
  }

  return (
    <div className="main-layout">
      <div className="content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h1 style={{ color: '#e8fff6', margin: 0 }}>Budgets</h1>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            + New Budget
          </button>
        </div>

        {loading ? (
          <div style={{ color: '#a7f3d0' }}>Loading...</div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Month</th>
                  <th>Year</th>
                  <th>Amount</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {budgets.map(budget => (
                  <tr key={budget._id}>
                    <td>{budget.categoryId?.name || 'N/A'}</td>
                    <td>{budget.month}</td>
                    <td>{budget.year}</td>
                    <td>${budget.amount.toFixed(2)}</td>
                    <td>
                      <button className="btn btn-small" style={{ marginRight: 8 }} onClick={() => handleEdit(budget)}>
                        Edit
                      </button>
                      <button className="btn btn-danger btn-small" onClick={() => handleDelete(budget._id)}>
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
              <h2>{editingId ? 'Edit' : 'New'} Budget</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Category</label>
                <select name="categoryId" value={formData.categoryId} onChange={handleChange} required>
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                  ))}
                </select>
              </div>
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
                <label>Amount</label>
                <input type="number" name="amount" value={formData.amount} onChange={handleChange} required step="0.01" />
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
