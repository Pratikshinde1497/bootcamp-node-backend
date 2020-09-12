const mongoose = require('mongoose');
const slugify = require('slugify');
const GeoCoder = require('../utils/geoCoder');

const BootcampSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'please enter name'],
    unique: true,
    trim: true,
    maxlength: [50, 'name cannot be more than 50 charcters']
  },
  slug: String,
  description: {
    type: String,
    required: [true, 'please add description'],
    maxlength: [500, 'description cannot be more than 500 charcters']
  },
  website: {
    type: String,
    match: [
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
      'please use valid URL with http or https'
    ]
  },
  phone: {
    type:String,
    maxlength: [20, 'phone number cannot be more than 20 numbers']
  },
  email: {
    type: String,
    match: [
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      'enter valid email'
    ]
  },
  address: {
    type: String,
    required: [true, 'please enter your address']
  },
  location: {
    //  GEOJSON point
    type: {
      type: String,
      enum: ['Point'],
    },
    coordinates: {
      type: [Number],
      index: '2dsphere'
    },
    formattedAddress: String,
    street: String,
    city: String,
    state: String,
    zipcode: String,
    country: String,
    
  },
  careers: {
    type: [String],
    required: true,
    enum: [
      'Web Development',
      'Mobile Development',
      'Swift Development',
      'UI/UX',
      'Data Science',
      'Business',
      'Other'
    ]
  },
  averageRating: {
    type: Number,
    min: [1, 'Rating cannot be less than 1'],
    max: [5, 'Rating cannot be more than 5']
  },
  averageCost: Number,
  photo: {
    type: String,
    default: 'no-photo.jpg'
  },
  housing: {
    type: Boolean,
    default: false
  },
  jobAssistance: {
    type: Boolean,
    default: false
  },
  jobGuarantee: {
    type: Boolean,
    default: false
  },
  acceptGi: {
    type: Boolean,
    default: false
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt:  {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

//  create bootcamp slug from name
BootcampSchema.pre('save', function(next){
  this.slug = slugify(this.name, { lower: true});
  next()
})

//  add location with geocoder
BootcampSchema.pre('save', async function(next) {
  const loc = await GeoCoder.geocode(this.address);
  this.location = {
    type: 'Point',
    coordinates: [loc[0].longitude, loc[0].latitude],
    formattedAddress: loc[0].formattedAddress,
    street: loc[0].streetName,
    city: loc[0].city,
    state: loc[0].state,
    zipcode: loc[0].zipcode,
    country: loc[0].countryCode
  }
  
//  do not save address in db
  this.address = undefined;
  next()
})

//  reverse populate courses with virtuals
BootcampSchema.virtual('courses', {
  ref: 'Course',
  localField: '_id',
  foreignField: 'bootcamp',
  justOne: false
})

//  reverse populate reviews with virtuals
BootcampSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'bootcamp',
  justOne: false
})

//  delete courses and reviews, when bootcamp is deleted
BootcampSchema.pre('remove', async function(next) {
  await this.model('Course').deleteMany({ bootcamp: this._id });
  await this.model('Review').deleteMany({ bootcamp: this._id });

  next();
})


module.exports = mongoose.model('Bootcamp', BootcampSchema);