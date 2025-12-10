import React, { useState, useEffect } from 'react'
import { getBudgetsByUser, createBudget, updateBudget, deleteBudget, getCategoriesByUser, getAllCategories, initUserCategories } from '../services/api'
import CategoryList from '../components/CategoryList'
import CategorySelect from '../components/CategorySelect'
import InlineCategoryCreator from '../components/InlineCategoryCreator'
import '../styles/main.css'

export default function Budgets() {
  const [budgets, setBudgets] = useState([])
  const [categories, setCategories] = useState([])
  const [activeCategory, setActiveCategory] = useState(null)
  const [filterMonth, setFilterMonth] = useState('')
  const [filterYear, setFilterYear] = useState('')
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [errorMsg, setErrorMsg] = useState('')
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
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

  useEffect(() => {
    if (showModal) {
      ensureCategories()
      if (!formData.categoryId && categories[0]?._id) {
        setFormData(prev => ({ ...prev, categoryId: categories[0]._id }))
      }
    }
  }, [showModal])

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
      if (!formData.categoryId && cats[0]?._id) {
        setFormData(prev => ({ ...prev, categoryId: cats[0]._id }))
      }
    } catch (err) {
      console.error('Error loading data:', err)
    }
    setLoading(false)
  }

  const ensureCategories = async () => {
    try {
      if (user?.userId && categories.length === 0) {
        await initUserCategories(user.userId)
        const refetched = await getCategoriesByUser(user.userId)
        const cats = Array.isArray(refetched) ? refetched : []
        setCategories(cats)
        if (cats[0]?._id) {
          setFormData(prev => ({ ...prev, categoryId: prev.categoryId || cats[0]._id }))
        }
      }
    } catch (e) {
      console.error('ensureCategories error:', e)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setErrorMsg('')
      setSaving(true)
      const v = {}
      if (!formData.categoryId) v.categoryId = 'Category required'
      if (!formData.month) v.month = 'Month required'
      if (!formData.year) v.year = 'Year required'
      if (!formData.amount || Number(formData.amount) <= 0) v.amount = 'Amount must be > 0'
      setErrors(v)
      if (Object.keys(v).length > 0) { setSaving(false); return }
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
      setErrorMsg(err.response?.data?.error || 'Failed to save budget')
    }
    setSaving(false)
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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 8, marginBottom: 12 }}>
          <div className="form-group">
            <label>Filter Month</label>
            <select value={filterMonth} onChange={(e) => setFilterMonth(e.target.value)}>
              <option value="">All</option>
              {months.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Filter Year</label>
            <input type="number" value={filterYear} onChange={(e) => setFilterYear(e.target.value)} placeholder="All" />
          </div>
        </div>
        <div className="dashboard-cards">
          <div className="dashboard-card">
            <div className="dashboard-card-title">Total Budget</div>
            <div className="dashboard-card-value">${budgets
              .filter(b => {
                const byCat = !activeCategory || (typeof b.categoryId === 'object' ? b.categoryId?._id : b.categoryId) === activeCategory
                const byMonth = !filterMonth || b.month === filterMonth
                const byYear = !filterYear || String(b.year) === String(filterYear)
                return byCat && byMonth && byYear
              })
              .reduce((s, b) => s + (b.amount || 0), 0)
              .toFixed(2)}</div>
          </div>
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
                {budgets
                  .filter(budget => {
                    const byCat = !activeCategory || (typeof budget.categoryId === 'object' ? budget.categoryId?._id : budget.categoryId) === activeCategory
                    const byMonth = !filterMonth || budget.month === filterMonth
                    const byYear = !filterYear || String(budget.year) === String(filterYear)
                    return byCat && byMonth && byYear
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
              <InlineCategoryCreator
                userId={user.userId}
                onCreated={(cat) => {
                  setCategories(prev => [...prev, cat])
                  setFormData(prev => ({ ...prev, categoryId: cat._id }))
                }}
              />
              {errors.categoryId && (
                <div className="error-message" style={{ marginBottom: 8 }}>{errors.categoryId}</div>
              )}
              {categories.length === 0 && user?.userId && (
                <div style={{ margin: '8px 0 12px 0' }}>
                  <button type="button" className="btn" onClick={ensureCategories}>Create default categories</button>
                </div>
              )}
              {errorMsg && (
                <div className="error-message" style={{ marginBottom: 8 }}>
                  {errorMsg}
                </div>
              )}
              <div className="form-group">
                <label>Month</label>
                <select name="month" value={formData.month} onChange={handleChange} required>
                  <option value="">Select Month</option>
                  {months.map(month => (
                    <option key={month} value={month}>{month}</option>
                  ))}
                </select>
              </div>
              {errors.month && (
                <div className="error-message" style={{ marginBottom: 8 }}>{errors.month}</div>
              )}
              <div className="form-group">
                <label>Year</label>
                <input type="number" name="year" value={formData.year} onChange={handleChange} required />
              </div>
              {errors.year && (
                <div className="error-message" style={{ marginBottom: 8 }}>{errors.year}</div>
              )}
              <div className="form-group">
                <label>Amount</label>
                <input type="number" name="amount" value={formData.amount} onChange={handleChange} required step="0.01" />
              </div>
              {errors.amount && (
                <div className="error-message" style={{ marginBottom: 8 }}>{errors.amount}</div>
              )}
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}
                disabled={saving || !formData.categoryId || !formData.month || !formData.year || !formData.amount || Number(formData.amount) <= 0}
              >
                {saving ? 'Saving…' : 'Save'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
