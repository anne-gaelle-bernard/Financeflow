import React, { useState, useEffect } from 'react'
import { getTransactionsByUser, createTransaction, updateTransaction, deleteTransaction, getCategoriesByUser, getAllCategories, initUserCategories } from '../services/api'
import CategoryList from '../components/CategoryList'
import CategorySelect from '../components/CategorySelect'
import InlineCategoryCreator from '../components/InlineCategoryCreator'
import '../styles/main.css'

export default function Transactions() {
  const [transactions, setTransactions] = useState([])
  const [categories, setCategories] = useState([])
  const [activeCategory, setActiveCategory] = useState(null)
  const [activeType, setActiveType] = useState('all')
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [errorMsg, setErrorMsg] = useState('')
  const [errors, setErrors] = useState({})
  const [formData, setFormData] = useState({
    categoryId: '',
    amount: '',
    type: 'expense',
    description: '',
    date: new Date().toISOString().slice(0,10)
  })

  const user = JSON.parse(localStorage.getItem('ff_user') || '{}')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [txRes, catRes] = await Promise.all([
        user?.userId ? getTransactionsByUser(user.userId) : Promise.resolve([]),
        user?.userId ? getCategoriesByUser(user.userId) : getAllCategories()
      ])
      setTransactions(Array.isArray(txRes) ? txRes : [])
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

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const openNew = params.get('new')
    const typeParam = params.get('type')
    if (openNew) {
      setShowModal(true)
      if (typeParam === 'income' || typeParam === 'expense') {
        setFormData(prev => ({ ...prev, type: typeParam }))
      }
      ensureCategories()
    }
  }, [])

  useEffect(() => {
    if (showModal) {
      ensureCategories()
      if (!formData.categoryId && categories[0]?._id) {
        setFormData(prev => ({ ...prev, categoryId: categories[0]._id }))
      }
    }
  }, [showModal])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setErrorMsg('')
      const v = {}
      if (!formData.categoryId) v.categoryId = 'Category required'
      if (!formData.type) v.type = 'Type required'
      if (!formData.amount || Number(formData.amount) <= 0) v.amount = 'Amount must be > 0'
      if (!formData.description) v.description = 'Description required'
      if (!formData.date) v.date = 'Date required'
      setErrors(v)
      if (Object.keys(v).length > 0) return
      const payload = {
        ...formData,
        userId: user.userId,
        amount: Number(formData.amount)
      }

      if (editingId) {
        await updateTransaction(editingId, payload)
      } else {
        await createTransaction(payload)
      }
      setActiveCategory(null)
      setFormData({ categoryId: '', amount: '', type: 'expense', description: '', date: new Date().toISOString().slice(0,10) })
      setEditingId(null)
      setShowModal(false)
      loadData()
    } catch (err) {
      console.error('Error saving transaction:', err)
      setErrorMsg(err.response?.data?.error || 'Failed to save transaction')
    }
  }

  const handleEdit = (tx) => {
    const cid = typeof tx.categoryId === 'object' ? tx.categoryId?._id : tx.categoryId
    setFormData({
      categoryId: cid || '',
      amount: tx.amount?.toString() || '',
      type: tx.type || 'expense',
      description: tx.description || '',
      date: tx.date ? new Date(tx.date).toISOString().slice(0,10) : new Date().toISOString().slice(0,10)
    })
    setEditingId(tx._id)
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await deleteTransaction(id)
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
          <h1 style={{ color: '#e8fff6', margin: 0 }}>Transactions</h1>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            + New Transaction
          </button>
        </div>

        <CategoryList categories={categories} selectedId={activeCategory} onSelect={setActiveCategory} />
        <div className="category-list" style={{ marginTop: 8 }}>
          <button className={`category-item ${activeType === 'all' ? 'active' : ''}`} onClick={() => setActiveType('all')}>All</button>
          <button className={`category-item ${activeType === 'income' ? 'active' : ''}`} onClick={() => setActiveType('income')}>Income</button>
          <button className={`category-item ${activeType === 'expense' ? 'active' : ''}`} onClick={() => setActiveType('expense')}>Expense</button>
        </div>
        <div className="dashboard-cards">
          <div className="dashboard-card">
            <div className="dashboard-card-title">Income</div>
            <div className="dashboard-card-value" style={{ color: '#86efac' }}>${transactions
              .filter(tx => {
                const byCat = !activeCategory || (typeof tx.categoryId === 'object' ? tx.categoryId?._id : tx.categoryId) === activeCategory
                const byType = activeType === 'all' || tx.type === activeType
                return byCat && byType
              })
              .filter(tx => tx.type === 'income')
              .reduce((s, tx) => s + (tx.amount || 0), 0)
              .toFixed(2)}</div>
          </div>
          <div className="dashboard-card">
            <div className="dashboard-card-title">Expenses</div>
            <div className="dashboard-card-value" style={{ color: '#fecaca' }}>${transactions
              .filter(tx => {
                const byCat = !activeCategory || (typeof tx.categoryId === 'object' ? tx.categoryId?._id : tx.categoryId) === activeCategory
                const byType = activeType === 'all' || tx.type === activeType
                return byCat && byType
              })
              .filter(tx => tx.type === 'expense')
              .reduce((s, tx) => s + (tx.amount || 0), 0)
              .toFixed(2)}</div>
          </div>
          <div className="dashboard-card">
            <div className="dashboard-card-title">Net</div>
            <div className="dashboard-card-value">${(() => {
              const list = transactions.filter(tx => {
                const byCat = !activeCategory || (typeof tx.categoryId === 'object' ? tx.categoryId?._id : tx.categoryId) === activeCategory
                const byType = activeType === 'all' || tx.type === activeType
                return byCat && byType
              })
              const inc = list.filter(tx => tx.type === 'income').reduce((s, tx) => s + (tx.amount || 0), 0)
              const exp = list.filter(tx => tx.type === 'expense').reduce((s, tx) => s + (tx.amount || 0), 0)
              return (inc - exp).toFixed(2)
            })()}</div>
          </div>
        </div>
        {loading ? (
          <div style={{ color: '#a7f3d0' }}>Loading...</div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Category</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {transactions
                  .filter(tx => {
                    const byCat = !activeCategory || (typeof tx.categoryId === 'object' ? tx.categoryId?._id : tx.categoryId) === activeCategory
                    const byType = activeType === 'all' || tx.type === activeType
                    return byCat && byType
                  })
                  .map(tx => (
                  <tr key={tx._id}>
                    <td>{new Date(tx.date).toLocaleDateString()}</td>
                    <td>{tx.categoryId?.name || 'N/A'}</td>
                    <td style={{ color: tx.type === 'income' ? '#86efac' : '#fecaca' }}>
                      {tx.type}
                    </td>
                    <td>${tx.amount.toFixed(2)}</td>
                    <td>{tx.description}</td>
                    <td>
                      <button className="btn btn-small" style={{ marginRight: 8 }} onClick={() => handleEdit(tx)}>
                        Edit
                      </button>
                      <button className="btn btn-danger btn-small" onClick={() => handleDelete(tx._id)}>
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
              <h2>{editingId ? 'Edit' : 'New'} Transaction</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <CategorySelect
                categories={categories}
                value={formData.categoryId}
                onChange={handleChange}
                label="Category"
              />
              {errors.categoryId && (
                <div className="error-message" style={{ marginBottom: 8 }}>{errors.categoryId}</div>
              )}
              <InlineCategoryCreator
                userId={user.userId}
                onCreated={(cat) => {
                  setCategories(prev => [...prev, cat])
                  setFormData(prev => ({ ...prev, categoryId: cat._id }))
                }}
              />
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
                <label>Type</label>
                <select name="type" value={formData.type} onChange={handleChange}>
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
              </div>
              {errors.type && (
                <div className="error-message" style={{ marginBottom: 8 }}>{errors.type}</div>
              )}
              <div className="form-group">
                <label>Amount</label>
                <input type="number" name="amount" value={formData.amount} onChange={handleChange} required step="0.01" />
              </div>
              {errors.amount && (
                <div className="error-message" style={{ marginBottom: 8 }}>{errors.amount}</div>
              )}
              <div className="form-group">
                <label>Date</label>
                <input type="date" name="date" value={formData.date} onChange={handleChange} required />
              </div>
              {errors.date && (
                <div className="error-message" style={{ marginBottom: 8 }}>{errors.date}</div>
              )}
              <div className="form-group">
                <label>Description</label>
                <input type="text" name="description" value={formData.description} onChange={handleChange} required />
              </div>
              {errors.description && (
                <div className="error-message" style={{ marginBottom: 8 }}>{errors.description}</div>
              )}
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}
                disabled={!formData.categoryId || !formData.type || !formData.amount || Number(formData.amount) <= 0 || !formData.description || !formData.date}
              >
                Save
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
