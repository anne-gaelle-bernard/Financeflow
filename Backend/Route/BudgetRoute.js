const express = require('express');
const router = express.Router();
const budgetController = require('../Controllers/BudgetController');
const { verifyToken } = require('../Middelwares/AuthMiddleware');

// All budget routes are protected
router.use(verifyToken);

// Get all budgets
router.get('/', budgetController.getAllBudgets);

// Get budgets by user ID
router.get('/user/:userId', budgetController.getBudgetsByUser);

// Get budget by ID
router.get('/:id', budgetController.getBudgetById);

// Create a new budget
router.post('/', budgetController.createBudget);

// Update budget by ID
router.put('/:id', budgetController.updateBudget);

// Delete budget by ID
router.delete('/:id', budgetController.deleteBudget);

module.exports = router;
