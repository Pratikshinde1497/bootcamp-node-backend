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
  req.body.user = req.user.id;

  const bootcamp = await Bootcamp.findById(req.params.bootcampId);
  
  //  if not found
  if (!bootcamp) {
    return next(new ErrorResponce(`No bootcamp found the id: ${req.params.bootcampId}`));
  }

  //  allow only if user is bootcamp owner || admin
  if (bootcamp.user != req.user.id && req.user.role !== "admin") {
    return next(new ErrorResponce(`${req.user.name} not authorized to add course in bootcamp: ${bootcamp.id}`, 403));
  }

  //  add course
  const course = await Course.create(req.body);
  res.status(200).json({
    success: true,
    data: course
  })
})

// @desc      Update course
// @route     PUT /api/v1/courses/:id
// @access    Private
exports.updateCourse = asyncHandler(async (req, res, next) => {
  
  const course = await Course.findById(req.params.id);
  //  not found
  if (!course) {
    return next(new ErrorResponce(`No Course found with id: ${req.params.id}`, 404));
  } 
  
  //  allow only if user is course owner || admin
  if (course.user != req.user.id && req.user.role !== "admin") {
    return next(new ErrorResponce(`${req.user.name} not authorized to update course: ${course.id}`, 403));
  }

  //  update
  const updated = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true});
  res.status(200).json({
    success: true,
    data: updated
  })
})

// @desc      Delete course
// @route     DELETE /api/v1/courses/:id
// @access    Private
exports.deleteCourse = asyncHandler(async (req, res, next) => {
  
  const course = await Course.findById(req.params.id);
  //  not found
  if (!course) {
    return next(new ErrorResponce(`No Course found with id: ${req.params.id}`, 404));
  } 
  
  //  allow only if user is course owner || admin
  if (course.user != req.user.id && req.user.role !== "admin") {
    return next(new ErrorResponce(`${req.user.name} not authorized to delete course: ${course.id}`, 403));
  }

  // delete
  await Course.findByIdAndDelete(req.params.id);
  res.status(200).json({
    success: true,
    data: {}
  })
})