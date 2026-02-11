const express = require('express');
const router = express.Router();
const meetingController = require('../interface/meeting.controller');
const { createMeetingDTO, updateMeetingDTO, getMeetingsDTO } = require('../dto/meeting.dto');
const validate = require('../../../middlewares/validator');
const { protect } = require('../../../middlewares/auth.middleware');

// All routes are protected (require authentication)
router.use(protect);

// @route   POST /api/meetings
// @desc    Create a new meeting
// @access  Private
router.post('/', createMeetingDTO, validate, meetingController.createMeeting.bind(meetingController));

// @route   GET /api/meetings
// @desc    Get all meetings with optional filters
// @access  Private
router.get('/', getMeetingsDTO, validate, meetingController.getMeetings.bind(meetingController));

// @route   GET /api/meetings/:id
// @desc    Get meeting by ID
// @access  Private
router.get('/:id', meetingController.getMeetingById.bind(meetingController));

// @route   PUT /api/meetings/:id
// @desc    Update meeting
// @access  Private
router.put('/:id', updateMeetingDTO, validate, meetingController.updateMeeting.bind(meetingController));

// @route   DELETE /api/meetings/:id
// @desc    Delete meeting
// @access  Private
router.delete('/:id', meetingController.deleteMeeting.bind(meetingController));

module.exports = router;
