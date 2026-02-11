const authService = require('../service/auth.service');
const { successResponse, errorResponse } = require('../../../utils/response');

class AuthController {
  // Register user
  async register(req, res, next) {
    try {
      const { user, token } = await authService.register(req.body);
      return successResponse(res, 201, 'User registered successfully', { user, token });
    } catch (error) {
      if (error.message === 'User with this email already exists') {
        return errorResponse(res, 400, error.message);
      }
      next(error);
    }
  }

  // Login user
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const { user, token } = await authService.login(email, password);
      return successResponse(res, 200, 'Login successful', { user, token });
    } catch (error) {
      if (error.message === 'Invalid email or password') {
        return errorResponse(res, 401, error.message);
      }
      next(error);
    }
  }
}

module.exports = new AuthController();
