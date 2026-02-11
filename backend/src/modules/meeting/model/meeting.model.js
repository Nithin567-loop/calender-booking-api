const mongoose = require('mongoose');

const meetingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  title: {
    type: String,
    required: [true, 'Meeting title is required'],
    trim: true,
    minlength: [3, 'Title must be at least 3 characters'],
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  startTime: {
    type: Date,
    required: [true, 'Start time is required']
  },
  endTime: {
    type: Date,
    required: [true, 'End time is required']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  }
}, {
  timestamps: true
});

// Index for faster conflict checks
meetingSchema.index({ userId: 1, startTime: 1 });
meetingSchema.index({ startTime: 1, endTime: 1 });

// Validation: startTime must be before endTime
meetingSchema.pre('save', function(next) {
  if (this.startTime >= this.endTime) {
    return next(new Error('Start time must be before end time'));
  }
  next();
});

module.exports = mongoose.model('Meeting', meetingSchema);
