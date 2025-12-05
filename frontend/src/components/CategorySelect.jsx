import React from 'react'

export default function CategorySelect({
  categories = [],
  value = '',
  onChange = () => {},
  required = true,
  label = 'Category',
  name = 'categoryId'
}) {
  return (
    <div className="form-group">
      <label>{label}</label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        disabled={categories.length === 0}
      >
        <option value="">{categories.length ? 'Select Category' : 'No categories available'}</option>
        {categories.map(cat => (
          <option key={cat._id} value={cat._id}>
            {cat.name}
          </option>
        ))}
      </select>
    </div>
  )
}

