const express  = require("express");
const router = express.Router();
const { getBootcamp, getBootcamps, deleteBootcamp, updateBootcamp, pushBootcamp, getBootcampsByRadius } = require('../controllers/bootcamps');

router.route('/radius/:zipcode/:distance').get(getBootcampsByRadius);

router.route('/')
  .get(getBootcamps)
  .post(pushBootcamp)

router.route('/:id')
  .get(getBootcamp)
  .put(updateBootcamp)
  .delete(deleteBootcamp)

module.exports = router;