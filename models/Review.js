const mongoose = require('mongoose');
const Bootcamp = require('./Bootcamp');
require('colors');

const ReviewSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    maxlength: 100,
    required: [true, 'please add title for the review']
  },
  text: {
    type: String,
    required: [true, 'please add some text for the review']
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: [true, 'add rating for the bootcamp between 1 to 5']
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

//  prevent user from writing multiple reviews for single bootcamp -- 1 to 1 relation
ReviewSchema.index({ bootcamp: 1, user: 1 }, { unique: true})

module.exports = mongoose.model('Review', ReviewSchema);