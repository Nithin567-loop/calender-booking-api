const express = require('express');
const router = express.Router();
const authController = require('../interface/auth.controller');
const { registerDTO, loginDTO } = require('../dto/auth.dto');
const validate = require('../../../middlewares/validator');

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', registerDTO, validate, authController.register.bind(authController));

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', loginDTO, validate, authController.login.bind(authController));

module.exports = router;
