const express = require('express');
//  merge params comming from diff routes
const router = express.Router({ mergeParams: true });
const { getCourses, getCourse, addCourse, updateCourse, deleteCourse } = require('../controllers/courses');
const QueryResponce = require('../middlewares/queryResponce');
const Course = require('../models/Course');
const { protect, authorize } = require('../middlewares/auth');

router.route('/')
  .get(QueryResponce(Course, {
    path: 'bootcamp',
    select: 'name description'
  }), getCourses)
  .post(protect, authorize('publisher', 'admin'), addCourse)

router.route('/:id')
  .get(getCourse)
  .put(protect, authorize('publisher', 'admin'), updateCourse)
  .delete(protect, authorize('publisher', 'admin'), deleteCourse)

module.exports = router;