const Meeting = require('../model/meeting.model');

class MeetingService {
  // Check for overlapping meetings
  async checkConflict(userId, startTime, endTime, excludeMeetingId = null) {
    try {
      const query = {
        userId,
        startTime: { $lt: new Date(endTime) },
        endTime: { $gt: new Date(startTime) }
      };

      // Exclude current meeting when updating
      if (excludeMeetingId) {
        query._id = { $ne: excludeMeetingId };
      }

      const conflictingMeeting = await Meeting.findOne(query);
      return conflictingMeeting;
    } catch (error) {
      throw error;
    }
  }

  // Create a new meeting
  async createMeeting(meetingData) {
    try {
      const { userId, startTime, endTime, title, description } = meetingData;

      // Validate time
      if (new Date(startTime) >= new Date(endTime)) {
        throw new Error('Start time must be before end time');
      }

      // Check for conflicts
      const conflict = await this.checkConflict(userId, startTime, endTime);
      if (conflict) {
        throw new Error('Time slot already booked');
      }

      const meeting = new Meeting({
        userId,
        title,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        description
      });

      await meeting.save();
      return await meeting.populate('userId', 'name email');
    } catch (error) {
      throw error;
    }
  }

  // Get all meetings with optional filters
  async getMeetings(filters = {}) {
    try {
      const query = {};

      // Filter by userId
      if (filters.userId) {
        query.userId = filters.userId;
      }

      // Filter by date range
      if (filters.startDate && filters.endDate) {
        query.startTime = {
          $gte: new Date(filters.startDate),
          $lte: new Date(filters.endDate)
        };
      } else if (filters.startDate) {
        query.startTime = { $gte: new Date(filters.startDate) };
      } else if (filters.endDate) {
        query.startTime = { $lte: new Date(filters.endDate) };
      }

      const meetings = await Meeting.find(query)
        .populate('userId', 'name email')
        .sort({ startTime: 1 });

      return meetings;
    } catch (error) {
      throw error;
    }
  }

  // Get meeting by ID
  async getMeetingById(meetingId) {
    try {
      const meeting = await Meeting.findById(meetingId)
        .populate('userId', 'name email');
      
      if (!meeting) {
        throw new Error('Meeting not found');
      }
      
      return meeting;
    } catch (error) {
      throw error;
    }
  }

  // Update meeting
  async updateMeeting(meetingId, userId, updateData) {
    try {
      const meeting = await Meeting.findById(meetingId);
      
      if (!meeting) {
        throw new Error('Meeting not found');
      }

      // Check if user owns the meeting
      if (meeting.userId.toString() !== userId.toString()) {
        throw new Error('Not authorized to update this meeting');
      }

      // If updating time, validate and check conflicts
      const newStartTime = updateData.startTime ? new Date(updateData.startTime) : meeting.startTime;
      const newEndTime = updateData.endTime ? new Date(updateData.endTime) : meeting.endTime;

      if (newStartTime >= newEndTime) {
        throw new Error('Start time must be before end time');
      }

      // Check for conflicts only if time is being updated
      if (updateData.startTime || updateData.endTime) {
        const conflict = await this.checkConflict(
          userId,
          newStartTime,
          newEndTime,
          meetingId
        );
        
        if (conflict) {
          throw new Error('Time slot already booked');
        }
      }

      // Update fields
      Object.assign(meeting, updateData);
      await meeting.save();

      return await meeting.populate('userId', 'name email');
    } catch (error) {
      throw error;
    }
  }

  // Delete meeting
  async deleteMeeting(meetingId, userId) {
    try {
      const meeting = await Meeting.findById(meetingId);
      
      if (!meeting) {
        throw new Error('Meeting not found');
      }

      // Check if user owns the meeting
      if (meeting.userId.toString() !== userId.toString()) {
        throw new Error('Not authorized to delete this meeting');
      }

      await meeting.deleteOne();
      return true;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new MeetingService();
