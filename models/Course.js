const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, 'please add title for the course']
  },
  description: {
    type: String,
    required: [true, 'please add description for the course']
  },
  weeks: {
    type: Number,
    required: [true, 'add number of weeks for the course']
  },
  tuitionCost: {
    type: Number,
    required: [true, 'add tuition cost of the course']
  },
  minimumSkill: {
    type: String,
    required: [true, 'add minimum skills required for the course'],
    enum: ['beginner', 'intermediate', 'advanced']
  },
  scholorshipAvailable: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  bootcamp: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Bootcamp'
  }
})

module.exports = mongoose.model('Course', CourseSchema);