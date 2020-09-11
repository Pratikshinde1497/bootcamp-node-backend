const asyncHandler = require("../middlewares/async");
const ErrorResponce = require("../utils/errorResponce");
const Review = require('../models/Review');
const Bootcamp = require('../models/Bootcamp');


// @desc      Get all reviews or of specific bootcamp
// @route     GET /api/v1/bootcamps/:bootcampId/reviews
// @route     GET /api/v1/reviews
// @access    Public
exports.getReviews = asyncHandler(async (req, res, next) => {
  if (req.params.bootcampId) {
    const bootcamp = await Review.findById(req.params.bootcampId);
    if(!bootcamp) {
      return next(new ErrorResponce(`no bootcamp with id: ${req.params.bootcampId}`, 404))
    }
    const reviews = await Review.find({ bootcamp: req.params.bootcampId });
    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews
    })
  } else {
    res.status(200).json(res.advancedResponce)
  }
})

// @desc      Get review by its id
// @route     GET /api/v1/reviews/:id
// @access    Public
exports.getReview = asyncHandler(async (req, res, next) => {
  //  find review populated with bootcamp details
  const review = await Review.findById(req.params.id).populate({
    path: 'Bootcamp',
    select: 'name description'
  });
  //  not found
  if(!review) {
    return next(new ErrorResponce(`no review found with id: ${req.params.id}`, 404))
  }
  res.status(200).json({
    success: true,
    data: review
  })
})

// @desc      add new review
// @route     POST /api/v1/bootcamps/:bootcampId/reviews
// @access    Private
exports.addReview = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.bootcampId);
  if(!bootcamp) {
    return next(new ErrorResponce(`no bootcamp found with id: ${req.params.bootcampId}`, 404));
  }
  //  append user and bootcamp from req object
  req.body.user = req.user.id;
  req.body.bootcamp = req.params.bootcampId;
  //  add review
  const review = await Review.create(req.body);
  // send response
  res.status(200).json({
    success: true,
    data: review
  })
})

// @desc      Update review by its id
// @route     PUT /api/v1/reviews/:id
// @access    Private
exports.updateReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id);
  console.log(req.params.id);
  if(!review) {
    return next(new ErrorResponce(`no review found with id: ${req.params.id}`, 404))
  }
  //  if user is not actual review writter or admin 
  if(review.user != req.user.id && req.user.role !== "admin") {
    return next(new ErrorResponce(`not authorized to make changes`, 400))
  }
  //  make update
  const updated = await Review.findByIdAndUpdate(req.params.id, req.body, { runValidators: true, new: true  });
  res.status(200).json({
    success: true,
    data: updated
  })
})

// @desc      delete review
// @route     DELETE /api/v1/reviews/:id
// @access    Private
exports.deleteReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id);
  console.log(req.params.id);
  if(!review) {
    return next(new ErrorResponce(`no review found with id: ${req.params.id}`, 404))
  }
  //  if user is not actual review writter or admin 
  if(review.user != req.user.id && req.user.role !== "admin") {
    return next(new ErrorResponce(`not authorized to make changes`, 400))
  }
  //  make update
  await Review.findByIdAndDelete(req.params.id);
  res.status(200).json({
    success: true,
    data: {}
  })
})
