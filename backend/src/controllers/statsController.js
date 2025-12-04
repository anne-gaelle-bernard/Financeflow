const Transaction = require('../models/Transaction')

async function balance(req, res) {
  const agg = await Transaction.aggregate([
    { $group: { _id: null, total: { $sum: '$amount' } } }
  ])
  const total = agg[0]?.total || 0
  res.json({ success: true, data: { balance: total } })
}

async function totalsByCategory(req, res) {
  const agg = await Transaction.aggregate([
    { $group: { _id: '$categoryId', total: { $sum: '$amount' }, count: { $sum: 1 } } },
    { $sort: { total: -1 } }
  ])
  res.json({ success: true, data: agg })
}

async function chartSeries(req, res) {
  const byMonth = await Transaction.aggregate([
    { $group: { _id: { $dateToString: { format: '%Y-%m', date: '$date' } }, total: { $sum: '$amount' } } },
    { $sort: { _id: 1 } }
  ])
  res.json({ success: true, data: { byMonth } })
}

module.exports = { balance, totalsByCategory, chartSeries }