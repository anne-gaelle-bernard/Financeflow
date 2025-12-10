import React, { useState } from 'react'
import { createCategory } from '../services/api'

export default function InlineCategoryCreator({ userId, onCreated }) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [color, setColor] = useState('#10b981')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const handleSave = async () => {
    try {
      setError('')
      setSaving(true)
      const res = await createCategory({ userId, name, description, color })
      const cat = res?.category || res?.data?.category || res?.data || null
      if (cat && cat._id) {
        onCreated(cat)
        setName('')
        setDescription('')
        setColor('#10b981')
        setOpen(false)
      } else {
        setError(res?.error || 'Unable to create category')
      }
    } catch (e) {
      setError(e.response?.data?.error || 'Unable to create category')
    } finally {
      setSaving(false)
    }
  }

  if (!open) {
    return (
      <div style={{ margin: '8px 0 12px 0' }}>
        <button type="button" className="btn" onClick={() => setOpen(true)}>Add Category</button>
      </div>
    )
  }

  return (
    <div className="table-container" style={{ marginBottom: 12 }}>
      <div className="form-group">
        <label>Name</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div className="form-group">
        <label>Description</label>
        <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>
      <div className="form-group">
        <label>Color</label>
        <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
      </div>
      {error && <div className="error-message" style={{ marginBottom: 8 }}>{error}</div>}
      <div style={{ display: 'flex', gap: 8 }}>
        <button type="button" className="btn" onClick={() => setOpen(false)}>Cancel</button>
        <button type="button" className="btn btn-primary" disabled={!name || saving} onClick={handleSave}>Save Category</button>
      </div>
    </div>
  )
}

