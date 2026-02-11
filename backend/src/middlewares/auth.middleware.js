const jwt = require('jsonwebtoken');
const config = require('../config/env');
const { errorResponse } = require('../utils/response');
const User = require('../modules/user/model/user.model');

// Protect routes - verify JWT token
const protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // Check if token exists
    if (!token) {
      return errorResponse(res, 401, 'Not authorized, no token provided');
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, config.jwt.secret);

      // Check if user still exists
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        return errorResponse(res, 401, 'User no longer exists');
      }

      // Attach user to request object
      req.user = user;
      next();
    } catch (error) {
      return errorResponse(res, 401, 'Not authorized, token invalid or expired');
    }
  } catch (error) {
    return errorResponse(res, 500, 'Server error in authentication');
  }
};

module.exports = { protect };
