import React, { useState, useEffect } from 'react'
import { getAllCategories, createCategory, updateCategory, deleteCategory } from '../services/api'
import '../styles/main.css'

export default function Categories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#000000'
  })

  const user = JSON.parse(localStorage.getItem('ff_user') || '{}')

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    setLoading(true)
    try {
      const res = await getAllCategories()
      setCategories(Array.isArray(res) ? res : [])
    } catch (err) {
      console.error('Error loading categories:', err)
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
        userId: user.userId
      }

      if (editingId) {
        await updateCategory(editingId, payload)
      } else {
        await createCategory(payload)
      }
      setFormData({ name: '', description: '', color: '#000000' })
      setEditingId(null)
      setShowModal(false)
      loadCategories()
    } catch (err) {
      console.error('Error saving category:', err)
    }
  }

  const handleEdit = (cat) => {
    setFormData(cat)
    setEditingId(cat._id)
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await deleteCategory(id)
        loadCategories()
      } catch (err) {
        console.error('Error deleting:', err)
      }
    }
  }

  return (
    <div className="main-layout">
      <div className="content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h1 style={{ color: '#e8fff6', margin: 0 }}>Categories</h1>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            + New Category
          </button>
        </div>

        {loading ? (
          <div style={{ color: '#a7f3d0' }}>Loading...</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 16 }}>
            {categories.map(cat => (
              <div key={cat._id} className="table-container" style={{ marginBottom: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: cat.color, marginRight: 12 }}></div>
                  <h3 style={{ color: '#e8fff6', margin: 0, flex: 1 }}>{cat.name}</h3>
                </div>
                <p style={{ color: '#a7f3d0', margin: '8px 0' }}>{cat.description}</p>
                <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                  <button className="btn btn-small" onClick={() => handleEdit(cat)}>Edit</button>
                  <button className="btn btn-danger btn-small" onClick={() => handleDelete(cat._id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        <div className={`modal ${showModal ? 'show' : ''}`} onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingId ? 'Edit' : 'New'} Category</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Description</label>
                <input type="text" name="description" value={formData.description} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Color</label>
                <input type="color" name="color" value={formData.color} onChange={handleChange} />
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
