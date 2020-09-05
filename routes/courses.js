const express = require('express');
//  merge params comming from diff routes
const router = express.Router({ mergeParams: true });
const { getCourses, getCourse, addCourse } = require('../controllers/courses');

router.route('/')
  .get(getCourses)
  .post(addCourse)

router.route('/:id')
  .get(getCourse);

module.exports = router;