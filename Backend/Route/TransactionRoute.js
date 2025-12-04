const express = require('express');
const router = express.Router();
const transactionController = require('../Controllers/TransactionController');
const { verifyToken } = require('../Middelwares/AuthMiddleware');

// All transaction routes are protected
router.use(verifyToken);

// Get all transactions
router.get('/', transactionController.getAllTransactions);

// Get transactions by user ID
router.get('/user/:userId', transactionController.getTransactionsByUser);

// Get transaction by ID
router.get('/:id', transactionController.getTransactionById);

// Create a new transaction
router.post('/', transactionController.createTransaction);

// Update transaction by ID
router.put('/:id', transactionController.updateTransaction);

// Delete transaction by ID
router.delete('/:id', transactionController.deleteTransaction);

module.exports = router;
