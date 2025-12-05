import React, { useState, useEffect } from 'react'
import { getBudgetsByUser, createBudget, updateBudget, deleteBudget, getCategoriesByUser, getAllCategories, initUserCategories } from '../services/api'
import CategoryList from '../components/CategoryList'
import CategorySelect from '../components/CategorySelect'
import '../styles/main.css'

export default function Budgets() {
  const [budgets, setBudgets] = useState([])
  const [categories, setCategories] = useState([])
  const [activeCategory, setActiveCategory] = useState(null)
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
        user?.userId ? getCategoriesByUser(user.userId) : getAllCategories()
      ])
      setBudgets(Array.isArray(budRes) ? budRes : [])
      let cats = Array.isArray(catRes) ? catRes : []
      if (user?.userId && cats.length === 0) {
        try {
          await initUserCategories(user.userId)
          const refetched = await getCategoriesByUser(user.userId)
          cats = Array.isArray(refetched) ? refetched : []
        } catch (e) {
          console.error('Error initializing categories:', e)
        }
      }
      setCategories(cats)
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
    const cid = typeof budget.categoryId === 'object' ? budget.categoryId?._id : budget.categoryId
    setFormData({
      categoryId: cid || '',
      amount: budget.amount?.toString() || '',
      month: budget.month || '',
      year: budget.year || new Date().getFullYear()
    })
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

        <CategoryList categories={categories} selectedId={activeCategory} onSelect={setActiveCategory} />
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
                {budgets
                  .filter(budget => {
                    if (!activeCategory) return true
                    const cid = typeof budget.categoryId === 'object' ? budget.categoryId?._id : budget.categoryId
                    return cid === activeCategory
                  })
                  .map(budget => (
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
              <CategorySelect
                categories={categories}
                value={formData.categoryId}
                onChange={handleChange}
                label="Category"
              />
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
