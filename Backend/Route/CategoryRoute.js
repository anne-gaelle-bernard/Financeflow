const express = require('express');
const router = express.Router();
const categoryController = require('../Controllers/CategoryController');
const { verifyToken } = require('../Middelwares/AuthMiddleware');

// Public route to initialize categories
router.post('/init', categoryController.initializeUserCategories);

// All other category routes are protected
router.use(verifyToken);

// Get all categories
router.get('/', categoryController.getAllCategories);

// Get categories by user ID
router.get('/user/:userId', categoryController.getCategoriesByUser);

// Get category by ID
router.get('/:id', categoryController.getCategoryById);

// Create a new category
router.post('/', categoryController.createCategory);

// Update category by ID
router.put('/:id', categoryController.updateCategory);

// Delete category by ID
router.delete('/:id', categoryController.deleteCategory);

module.exports = router;
