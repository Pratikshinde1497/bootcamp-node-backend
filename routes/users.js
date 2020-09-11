const express = require('express');
const router = express.Router();
const { getUser, deleteUser, updateUser, getUsers, addUser } = require('../controllers/users');
const { protect, authorize } = require('../middlewares/auth');
const User = require('../models/User');
const QueryResponce = require('../middlewares/queryResponce');


//  make private/admin
router.use(protect);
router.use(authorize('admin'));

//  routes
router.route('/')
  .get(QueryResponce(User), getUsers)
  .post(addUser);

router.route('/:id')
  .get(getUser)
  .put(updateUser)
  .delete(deleteUser);

module.exports = router;