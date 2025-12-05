import React, { useState, useEffect } from 'react'
import { fetchTransactions, createTransaction, updateTransaction, deleteTransaction, getCategoriesByUser } from '../services/api'
import '../styles/main.css'

export default function Transactions() {
  const [transactions, setTransactions] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    categoryId: '',
    amount: '',
    type: 'expense',
    description: ''
  })

  const user = JSON.parse(localStorage.getItem('ff_user') || '{}')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [txRes, catRes] = await Promise.all([
        fetchTransactions(),
        getCategoriesByUser(user.userId)
      ])
      setTransactions(Array.isArray(txRes) ? txRes : [])
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
        amount: Number(formData.amount)
      }

      if (editingId) {
        await updateTransaction(editingId, payload)
      } else {
        await createTransaction(payload)
      }
      setFormData({ categoryId: '', amount: '', type: 'expense', description: '' })
      setEditingId(null)
      setShowModal(false)
      loadData()
    } catch (err) {
      console.error('Error saving transaction:', err)
    }
  }

  const handleEdit = (tx) => {
    setFormData(tx)
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
                {transactions.map(tx => (
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
                <label>Type</label>
                <select name="type" value={formData.type} onChange={handleChange}>
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
              </div>
              <div className="form-group">
                <label>Amount</label>
                <input type="number" name="amount" value={formData.amount} onChange={handleChange} required step="0.01" />
              </div>
              <div className="form-group">
                <label>Description</label>
                <input type="text" name="description" value={formData.description} onChange={handleChange} required />
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
