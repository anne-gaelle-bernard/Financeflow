const express = require('express');
const router = express.Router();
const userController = require('../Controllers/UsersController');
const { verifyToken } = require('../Middelwares/AuthMiddleware');

// Public routes (must be before :id routes)
router.post('/register', userController.createUser);
router.post('/login', userController.loginUser);

// Protected routes
router.get('/', verifyToken, userController.getAllUsers);
router.get('/:id', verifyToken, userController.getUserById);
router.put('/:id', verifyToken, userController.updateUser);
router.delete('/:id', verifyToken, userController.deleteUser);

module.exports = router;