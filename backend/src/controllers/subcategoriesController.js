const Subcategory = require('../models/Subcategory')

async function list(req, res) {
  const { categoryId } = req.query
  const q = {}
  if (categoryId) q.categoryId = categoryId
  const items = await Subcategory.find(q).sort({ name: 1 })
  res.json({ success: true, data: items })
}

async function create(req, res) {
  const created = await Subcategory.create(req.body)
  res.status(201).json({ success: true, message: 'Subcategory created', data: created })
}

async function update(req, res) {
  const updated = await Subcategory.findByIdAndUpdate(req.params.id, req.body, { new: true })
  if (!updated) return res.status(404).json({ success: false, message: 'Not found' })
  res.json({ success: true, message: 'Subcategory updated', data: updated })
}

async function remove(req, res) {
  const deleted = await Subcategory.findByIdAndDelete(req.params.id)
  if (!deleted) return res.status(404).json({ success: false, message: 'Not found' })
  res.json({ success: true, message: 'Subcategory deleted', id: req.params.id })
}

module.exports = { list, create, update, remove }