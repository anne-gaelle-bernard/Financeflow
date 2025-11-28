const Category = require('../models/Category')

async function list(req, res) {
  const items = await Category.find().sort({ name: 1 })
  res.json({ success: true, data: items })
}

async function get(req, res) {
  const item = await Category.findById(req.params.id)
  if (!item) return res.status(404).json({ success: false, message: 'Not found' })
  res.json({ success: true, data: item })
}

async function create(req, res) {
  const created = await Category.create(req.body)
  res.status(201).json({ success: true, message: 'Category created', data: created })
}

async function update(req, res) {
  const updated = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true })
  if (!updated) return res.status(404).json({ success: false, message: 'Not found' })
  res.json({ success: true, message: 'Category updated', data: updated })
}

async function remove(req, res) {
  const deleted = await Category.findByIdAndDelete(req.params.id)
  if (!deleted) return res.status(404).json({ success: false, message: 'Not found' })
  res.json({ success: true, message: 'Category deleted', id: req.params.id })
}

module.exports = { list, get, create, update, remove }