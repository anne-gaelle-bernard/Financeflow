import React from 'react'

export default function CategoryList({ categories = [], selectedId = null, onSelect = () => {} }) {
  const handleSelect = (id) => {
    onSelect(id === selectedId ? null : id)
  }

  return (
    <div className="category-list">
      <button
        className={`category-item ${selectedId === null ? 'active' : ''}`}
        onClick={() => onSelect(null)}
      >
        All
      </button>
      {categories.map(cat => (
        <button
          key={cat._id}
          className={`category-item ${selectedId === cat._id ? 'active' : ''}`}
          onClick={() => handleSelect(cat._id)}
          title={cat.description || cat.name}
        >
          <span className="category-dot" style={{ backgroundColor: cat.color || '#10b981' }} />
          {cat.name}
        </button>
      ))}
    </div>
  )
}

