const express = require('express');
//  merge params comming from diff routes
const router = express.Router({ mergeParams: true });
const { getCourses, getCourse, addCourse, updateCourse, deleteCourse } = require('../controllers/courses');

router.route('/')
  .get(getCourses)
  .post(addCourse)

router.route('/:id')
  .get(getCourse)
  .put(updateCourse)
  .delete(deleteCourse)

module.exports = router;