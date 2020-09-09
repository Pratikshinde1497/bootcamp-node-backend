const express = require('express');
const router = express.Router();
const { getUser, deleteUser, updateUser, getUsers } = require('../controllers/users');
const { protect, authorize } = require('../middlewares/auth');
const User = require('../models/User');
const QueryResponce = require('../middlewares/queryResponce');


//  routes
router.route('/')
  .get(protect, authorize('admin'), QueryResponce(User), getUsers);

router.route('/:id')
  .get(protect, authorize('admin'), getUser)
  .put(protect, authorize('admin'), updateUser)
  .delete(protect, authorize('admin'), deleteUser);

module.exports = router;