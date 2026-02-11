const userService = require('../service/user.service');
const { successResponse, errorResponse } = require('../../../utils/response');

class UserController {
  // Create user
  async createUser(req, res, next) {
    try {
      const user = await userService.createUser(req.body);
      return successResponse(res, 201, 'User created successfully', user);
    } catch (error) {
      if (error.message === 'User with this email already exists') {
        return errorResponse(res, 400, error.message);
      }
      next(error);
    }
  }

  // Get user by ID
  async getUserById(req, res, next) {
    try {
      const user = await userService.getUserById(req.params.id);
      return successResponse(res, 200, 'User retrieved successfully', user);
    } catch (error) {
      if (error.message === 'User not found') {
        return errorResponse(res, 404, error.message);
      }
      next(error);
    }
  }

  // Get all users
  async getAllUsers(req, res, next) {
    try {
      const users = await userService.getAllUsers();
      return successResponse(res, 200, 'Users retrieved successfully', users);
    } catch (error) {
      next(error);
    }
  }

  // Get current user
  async getCurrentUser(req, res, next) {
    try {
      const user = await userService.getUserById(req.user.id);
      return successResponse(res, 200, 'Current user retrieved successfully', user);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();
