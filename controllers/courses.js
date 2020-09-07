const asyncHandler = require("../middlewares/async");
const ErrorResponce = require("../utils/errorResponce");
const Course = require('../models/Course');
const Bootcamp = require('../models/Bootcamp');


// @desc      Get all courses or of specific bootcamp
// @route     GET /api/v1/bootcamps/:bootcampId/courses
// @route     GET /api/v1/courses
// @access    Pubic
exports.getCourses = asyncHandler(async (req, res, next) => {
  if (req.params.bootcampId) {
    const Resource = await Course.find({ bootcamp: req.params.bootcampId });
    res.status(200).json({
      success: true,
      data: Resource
    })
  } else {
    res.status(200).json(res.advancedResponce)
  }
})

// @desc      Get a specigic course
// @route     GET /api/v1/courses/:id
// @access    Pubic
exports.getCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id ).populate({
    path: 'bootcamp',
    select: 'name description'
  });

  if(!course) {
    next(new ErrorResponce(`no Course found`, 404));
  }
  else {
    res.status(200).json({
      success: true,
      data: course
    })
  }
})

// @desc      Add a course
// @route     POST /api/v1/bootcamps/:bootcampId/courses
// @access    Private
exports.addCourse = asyncHandler(async (req, res, next) => {

  req.body.bootcamp = req.params.bootcampId;

  const bootcamp = Bootcamp.findById(req.params.bootcampId);
  if (!bootcamp) {
    next(new ErrorResponce(`No bootcamp found the id: ${req.params.bootcampId}`))
  }
  else{
    const course = await Course.create(req.body);
    res.status(200).json({
      success: true,
      data: course
    })
  }
})

// @desc      Update course
// @route     PUT /api/v1/courses/:id
// @access    Private
exports.updateCourse = asyncHandler(async (req, res, next) => {
  
  const course = await Course.findById(req.params.id);
  if (!course) {
    next(new ErrorResponce(`No Course found with id: ${req.params.id}`));
  } else {
    const updated = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true});
    res.status(200).json({
      success: true,
      data: updated
    })
  }
})

// @desc      Delete course
// @route     DELETE /api/v1/courses/:id
// @access    Private
exports.deleteCourse = asyncHandler(async (req, res, next) => {
  
  const course = await Course.findById(req.params.id);
  if (!course) {
    next(new ErrorResponce(`No Course found with id: ${req.params.id}`));
  } else {
    await Course.findByIdAndDelete(req.params.id);
    res.status(200).json({
      success: true,
      data: {}
    })
  }
})