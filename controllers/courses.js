const asyncHandler = require("../middlewares/async");
const ErrorResponce = require("../utils/errorResponce");
const Course = require('../models/Course');


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
  const course = await Course.findById(req.params.id );

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