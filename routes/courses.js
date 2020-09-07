const express = require('express');
//  merge params comming from diff routes
const router = express.Router({ mergeParams: true });
const { getCourses, getCourse, addCourse, updateCourse, deleteCourse } = require('../controllers/courses');
const QueryResponce = require('../middlewares/queryResponce');
const Course = require('../models/Course');

router.route('/')
  .get(QueryResponce(Course, {
    path: 'bootcamp',
    select: 'name description'
  }), getCourses)
  .post(addCourse)

router.route('/:id')
  .get(getCourse)
  .put(updateCourse)
  .delete(deleteCourse)

module.exports = router;