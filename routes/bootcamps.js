const express  = require("express");
const courseRouter = require('./courses');
const router = express.Router();
const { getBootcamp, getBootcamps, deleteBootcamp, updateBootcamp, pushBootcamp, getBootcampsByRadius } = require('../controllers/bootcamps');
const QueryResponce = require('../middlewares/queryResponce');
const Bootcamp = require('../models/Bootcamp');
const { protect } = require("../middlewares/auth");

//  pass route to other routes if they belongs to others
router.use('/:bootcampId/courses', courseRouter);

//  bootcamps own routes
router.route('/radius/:zipcode/:distance').get(getBootcampsByRadius);

router.route('/')
  .get(QueryResponce(Bootcamp, 'courses'), getBootcamps)
  .post(protect, pushBootcamp)

router.route('/:id')
  .get(getBootcamp)
  .put(protect, updateBootcamp)
  .delete(protect, deleteBootcamp)


module.exports = router;