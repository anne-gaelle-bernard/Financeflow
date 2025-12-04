const Transaction = require('../models/Transaction')

async function list(req, res) {
  const { categoryId, subcategoryId, startDate, endDate, min, max, sort } = req.query
  const q = {}
  if (categoryId) q.categoryId = categoryId
  if (subcategoryId) q.subcategoryId = subcategoryId
  if (startDate || endDate) {
    q.date = {}
    if (startDate) q.date.$gte = new Date(startDate)
    if (endDate) q.date.$lte = new Date(endDate)
  }
  if (min || max) {
    q.amount = {}
    if (min) q.amount.$gte = Number(min)
    if (max) q.amount.$lte = Number(max)
  }
  const sortMap = {
    date_asc: { date: 1 },
    date_desc: { date: -1 },
    amount_asc: { amount: 1 },
    amount_desc: { amount: -1 },
    title_asc: { title: 1 },
    title_desc: { title: -1 },
  }
  const s = sortMap[sort] || { date: -1, _id: -1 }
  const items = await Transaction.find(q).sort(s).limit(500)
  res.json({ success: true, data: items })
}

async function get(req, res) {
  const item = await Transaction.findById(req.params.id)
  if (!item) return res.status(404).json({ success: false, message: 'Not found' })
  res.json({ success: true, data: item })
}

async function create(req, res) {
  const created = await Transaction.create(req.body)
  res.status(201).json({ success: true, message: 'Transaction created', data: created })
}

async function update(req, res) {
  const updated = await Transaction.findByIdAndUpdate(req.params.id, req.body, { new: true })
  if (!updated) return res.status(404).json({ success: false, message: 'Not found' })
  res.json({ success: true, message: 'Transaction updated', data: updated })
}

async function remove(req, res) {
  const deleted = await Transaction.findByIdAndDelete(req.params.id)
  if (!deleted) return res.status(404).json({ success: false, message: 'Not found' })
  res.json({ success: true, message: 'Transaction deleted', id: req.params.id })
}

module.exports = { list, get, create, update, remove }