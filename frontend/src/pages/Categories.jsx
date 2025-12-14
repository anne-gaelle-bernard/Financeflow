import React, { useState, useEffect } from 'react'
import { getAllCategories, createCategory, updateCategory, deleteCategory } from '../services/api'
import BottomNav from '../components/BottomNav'
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
    if (window.confirm('Êtes-vous sûr ?')) {
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
        <div className="page-header">
          <h1>🏷️ Catégories</h1>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            + Nouvelle catégorie
          </button>
        </div>

        {loading ? (
          <div>Chargement...</div>
        ) : (
          <div className="category-grid">
            {categories.map(cat => (
              <div key={cat._id} className="category-card" style={{ borderLeftColor: cat.color || '#10b981' }}>
                <div className="category-card-header">
                  <h3>{cat.name}</h3>
                  <div className="category-color" style={{ backgroundColor: cat.color || '#10b981' }}></div>
                </div>
                {cat.description && <p className="category-description">{cat.description}</p>}
                <div className="action-buttons">
                  <button className="btn btn-small" onClick={() => handleEdit(cat)}>Modifier</button>
                  <button className="btn btn-danger btn-small" onClick={() => handleDelete(cat._id)}>Supprimer</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        <div className={`modal ${showModal ? 'show' : ''}`} onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingId ? 'Modifier' : 'Nouvelle'} Catégorie</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Nom</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Description</label>
                <input type="text" name="description" value={formData.description} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Couleur</label>
                <input type="color" name="color" value={formData.color} onChange={handleChange} />
              </div>
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
