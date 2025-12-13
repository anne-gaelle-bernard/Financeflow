const express = require('express')
const router = express.Router()
const SavingsController = require('../Controllers/SavingsController')
const { verifyToken } = require('../Middelwares/AuthMiddleware')

// Get all savings for a user
router.get('/user/:userId', verifyToken, SavingsController.getSavingsByUser)

// Get total savings for a user
router.get('/user/:userId/total', verifyToken, SavingsController.getTotalSavings)

// Create new savings entry
router.post('/', verifyToken, SavingsController.createSavings)

// Update savings entry
router.put('/:id', verifyToken, SavingsController.updateSavings)

// Delete savings entry
router.delete('/:id', verifyToken, SavingsController.deleteSavings)

module.exports = router
