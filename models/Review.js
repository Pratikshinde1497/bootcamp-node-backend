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

//  calcuate average rating of bootcamp  
ReviewSchema.statics.averageRating = async function(bootcampId) {
  const obj = await this.aggregate([
    {
      $match: { bootcamp: bootcampId  }
    },
    {
      $group: {
        _id: '$bootcamp',
        averageRating: {  $avg: '$rating'  }
      }
    }
  ])

  try {
    await Bootcamp.findByIdAndUpdate(bootcampId, {
      averageRating: obj[0].averageRating
    })
  } catch (err) {
    console.error(err);
  }
}
//  before adding new review
ReviewSchema.post('save', function (next) {
  this.constructor.averageRating(this.bootcamp);
})
//  after removing review
ReviewSchema.pre('remove', function (next) {
  this.constructor.averageRating(this.bootcamp);
})
module.exports = mongoose.model('Review', ReviewSchema);