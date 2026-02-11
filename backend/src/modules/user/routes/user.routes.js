const express = require('express');
const router = express.Router();
const userController = require('../interface/user.controller');
const { protect } = require('../../../middlewares/auth.middleware');

// @route   GET /api/users/me
// @desc    Get current user
// @access  Private
router.get('/me', protect, userController.getCurrentUser.bind(userController));

// @route   GET /api/users
// @desc    Get all users
// @access  Private
router.get('/', protect, userController.getAllUsers.bind(userController));

// @route   GET /api/users/:id
// @desc    Get user by ID
// @access  Private
router.get('/:id', protect, userController.getUserById.bind(userController));

module.exports = router;
