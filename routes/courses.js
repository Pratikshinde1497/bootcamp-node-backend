const express = require('express');
//  merge params comming from diff routes
const router = express.Router({ mergeParams: true });
const { getCourses, getCourse, addCourse, updateCourse, deleteCourse } = require('../controllers/courses');
const QueryResponce = require('../middlewares/queryResponce');
const Course = require('../models/Course');
const { protect } = require('../middlewares/auth');

router.route('/')
  .get(QueryResponce(Course, {
    path: 'bootcamp',
    select: 'name description'
  }), getCourses)
  .post(protect, addCourse)

router.route('/:id')
  .get(getCourse)
  .put(protect, updateCourse)
  .delete(protect, deleteCourse)

module.exports = router;