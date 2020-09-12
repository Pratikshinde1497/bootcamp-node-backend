const express  = require("express");
//  load other routes
const courseRouter = require('./courses');
const reviewRouter = require('./reviews');

const router = express.Router();
const { getBootcamp, getBootcamps, deleteBootcamp, updateBootcamp, pushBootcamp, getBootcampsByRadius } = require('../controllers/bootcamps');
const QueryResponce = require('../middlewares/queryResponce');
const Bootcamp = require('../models/Bootcamp');
const { protect, authorize } = require("../middlewares/auth");

//  pass route to other routes if they belongs to others
router.use('/:bootcampId/courses', courseRouter);
router.use('/:bootcampId/reviews', reviewRouter);

//  bootcamps own routes
router.route('/radius/:zipcode/:distance').get(getBootcampsByRadius);

router.route('/')
  .get(QueryResponce(Bootcamp, 'courses', 'reviews'), getBootcamps)
  .post(protect, authorize('publisher', 'admin'), pushBootcamp)

router.route('/:id')
  .get(getBootcamp)
  .put(protect, authorize('publisher', 'admin'), updateBootcamp)
  .delete(protect, authorize('publisher', 'admin'), deleteBootcamp)


module.exports = router;