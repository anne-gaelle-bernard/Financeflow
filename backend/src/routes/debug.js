const express = require('express')
const mongoose = require('mongoose')
const User = require('../models/User')
const Transaction = require('../models/Transaction')

const router = express.Router()

router.get('/db', async (req, res) => {
  const conn = mongoose.connection
  const readyMap = { 0: 'disconnected', 1: 'connected', 2: 'connecting', 3: 'disconnecting' }
  let users = null, transactions = null, error = null
  try {
    users = await User.countDocuments()
    transactions = await Transaction.countDocuments()
  } catch (e) {
    error = e.message
  }
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/financeflow'
  res.json({
    success: true,
    data: {
      mongoose: {
        state: readyMap[conn.readyState] || conn.readyState,
        host: conn.host,
        name: conn.name,
        user: conn.user || null
      },
      env: {
        mongoUri: uri
      },
      counts: {
        users,
        transactions
      },
      error
    }
  })
})

module.exports = router