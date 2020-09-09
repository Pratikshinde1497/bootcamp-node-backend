const mongoose = require('mongoose');
const Bootcamp = require('./Bootcamp');
require('colors');

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
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  }
})

//  create static function changeAverageCost
CourseSchema.statics.changeAverageCost = async function(bootcampId) {
  const obj = await this.aggregate([
    {
      $match: { bootcamp: bootcampId  }
    },
    {
      $group: {
        _id: '$bootcamp',
        averageCost: { $avg: '$tuitionCost'  }
      }
    }
  ])
  try {
    await Bootcamp.findByIdAndUpdate(bootcampId, {
      averageCost: Math.ceil(obj[0].averageCost / 10 ) * 10
    })
  } catch (err) {
    console.error(err);
  }
}

//  call changeAverageCost fun. after saving new course
CourseSchema.post('save', async function(next) {
  this.constructor.changeAverageCost(this.bootcamp)
})

//  call changeAverageCost fun. before removing any course
CourseSchema.pre('remove', async function(next) {
  this.constructor.changeAverageCost(this.bootcamp)
  
})
module.exports = mongoose.model('Course', CourseSchema);