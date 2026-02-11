const meetingService = require('../service/meeting.service');
const { successResponse, errorResponse } = require('../../../utils/response');

class MeetingController {
  // Create meeting
  async createMeeting(req, res, next) {
    try {
      const meetingData = {
        ...req.body,
        userId: req.user.id // Get userId from authenticated user
      };

      const meeting = await meetingService.createMeeting(meetingData);
      return successResponse(res, 201, 'Meeting created successfully', meeting);
    } catch (error) {
      if (error.message === 'Time slot already booked') {
        return errorResponse(res, 400, error.message);
      }
      if (error.message === 'Start time must be before end time') {
        return errorResponse(res, 400, error.message);
      }
      next(error);
    }
  }

  // Get all meetings with filters
  async getMeetings(req, res, next) {
    try {
      const filters = {
        userId: req.query.userId,
        startDate: req.query.startDate,
        endDate: req.query.endDate
      };

      const meetings = await meetingService.getMeetings(filters);
      return successResponse(res, 200, 'Meetings retrieved successfully', meetings);
    } catch (error) {
      next(error);
    }
  }

  // Get meeting by ID
  async getMeetingById(req, res, next) {
    try {
      const meeting = await meetingService.getMeetingById(req.params.id);
      return successResponse(res, 200, 'Meeting retrieved successfully', meeting);
    } catch (error) {
      if (error.message === 'Meeting not found') {
        return errorResponse(res, 404, error.message);
      }
      next(error);
    }
  }

  // Update meeting
  async updateMeeting(req, res, next) {
    try {
      const meeting = await meetingService.updateMeeting(
        req.params.id,
        req.user.id,
        req.body
      );
      return successResponse(res, 200, 'Meeting updated successfully', meeting);
    } catch (error) {
      if (error.message === 'Meeting not found') {
        return errorResponse(res, 404, error.message);
      }
      if (error.message === 'Not authorized to update this meeting') {
        return errorResponse(res, 403, error.message);
      }
      if (error.message === 'Time slot already booked') {
        return errorResponse(res, 400, error.message);
      }
      if (error.message === 'Start time must be before end time') {
        return errorResponse(res, 400, error.message);
      }
      next(error);
    }
  }

  // Delete meeting
  async deleteMeeting(req, res, next) {
    try {
      await meetingService.deleteMeeting(req.params.id, req.user.id);
      return successResponse(res, 200, 'Meeting deleted successfully');
    } catch (error) {
      if (error.message === 'Meeting not found') {
        return errorResponse(res, 404, error.message);
      }
      if (error.message === 'Not authorized to delete this meeting') {
        return errorResponse(res, 403, error.message);
      }
      next(error);
    }
  }
}

module.exports = new MeetingController();
