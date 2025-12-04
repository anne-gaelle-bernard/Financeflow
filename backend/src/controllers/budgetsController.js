const Budget = require('../models/Budget')

async function list(req, res) {
  const { category, subcategory } = req.query
  const q = {}
  if (category) q.category = category
  if (subcategory) q.subcategory = subcategory
  const items = await Budget.find(q)
  res.json({ success: true, data: items })
}

async function create(req, res) {
  const created = await Budget.create(req.body)
  res.status(201).json({ success: true, message: 'Budget created', data: created })
}

async function update(req, res) {
  const updated = await Budget.findByIdAndUpdate(req.params.id, req.body, { new: true })
  if (!updated) return res.status(404).json({ success: false, message: 'Not found' })
  res.json({ success: true, message: 'Budget updated', data: updated })
}

async function remove(req, res) {
  const deleted = await Budget.findByIdAndDelete(req.params.id)
  if (!deleted) return res.status(404).json({ success: false, message: 'Not found' })
  res.json({ success: true, message: 'Budget deleted', id: req.params.id })
}

module.exports = { list, create, update, remove }