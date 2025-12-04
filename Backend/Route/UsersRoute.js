const express = require('express');
const router = express.Router();
const userController = require('../Controllers/UsersController');
const { verifyToken } = require('../Middelwares/AuthMiddleware');

// Get all users (public)
router.get('/', userController.getAllUsers);

// Get user by ID (protected)
router.get('/:id', verifyToken, userController.getUserById);

// Register a new user (public)
router.post('/register', userController.createUser);

// Login a user (public)
router.post('/login', userController.loginUser);

// Update user by ID (protected)
router.put('/:id', verifyToken, userController.updateUser);

// Delete user by ID (protected)
router.delete('/:id', verifyToken, userController.deleteUser);

module.exports = router;