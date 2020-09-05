const asyncHandler = require("../middlewares/async");
const ErrorResponce = require("../utils/errorResponce");
const Course = require('../models/Course');
const Bootcamp = require('../models/Bootcamp');


// @desc      Get all courses or of specific bootcamp
// @route     GET /api/v1/bootcamps/:bootcampId/courses
// @route     GET /api/v1/courses
// @access    Pubic
exports.getCourses = asyncHandler(async (req, res, next) => {
  let query;
  if (req.params.bootcampId) {
    query = Course.find({ bootcamp: req.params.bootcampId });
  } else {
    query = Course.find().populate({
      path: 'bootcamp',
      select: 'name description'
    });
  }
  const courses = await query;
  if(!courses) {
    next(new ErrorResponce(`no Course found`, 404));
  }
  else {
    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses
    })
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