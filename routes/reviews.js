const express = require('express');
//  merge params comming from diff routes
const router = express.Router({ mergeParams: true });
const { getReviews, getReview, addReview, updateReview, deleteReview} = require('../controllers/reviews');
const QueryResponce = require('../middlewares/queryResponce');
const Review = require('../models/Review');
const { protect, authorize } = require('../middlewares/auth');

//  paths
router.route('/')
  .get(QueryResponce(Review, {
      path: 'bootcamp',
      select: 'name description'
    }), 
    getReviews)
  .post(protect, authorize('admin', 'user'), addReview);

router.route('/:id')
  .get(getReview)
  .put(protect, authorize('user', 'admin'),updateReview)
  .delete(protect, authorize('user', 'admin'), deleteReview)

  module.exports = router;