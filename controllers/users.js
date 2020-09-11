const asyncHandler = require('../middlewares/async');
const User = require('../models/User');
const ErrorResponce = require('../utils/errorResponce');

// @desc      Get all users
// @route     GET /api/v1/users
// @access    Private/admin
exports.getUsers = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResponce);
})

// @desc      Get a user
// @route     GET /api/v1/users/:id
// @access    Private/admin
exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if(!user) {
    return next(new ErrorResponce(`no user found`, 404))
  }
  res.status(200).json({
    success: true,
    data: user
  })
})

// @desc      Add new User
// @route     POST /api/v1/users
// @access    Private/admin
exports.addUser = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);
  res.status(201).json({
    success: true,
    data: user
  })
})

// @desc      Update a user
// @route     PUT /api/v1/users/:id
// @access    Private/admin
exports.updateUser = asyncHandler(async (req, res, next) => {
  const updated = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true});
  if (!updated) {    
    return next(new ErrorResponce(`user not found with id: ${req.params.id}`, 404));
  }
  res.status(200).json({
    success: true,
    data: updated
  })
})

// @desc      Delete a user
// @route     DELETE /api/v1/users/:id
// @access    Private/admin
exports.deleteUser = asyncHandler(async (req, res, next) => {
  const deleted = await User.findById(req.params.id);
  if (!deleted) {
    return next(new ErrorResponce(`user not found with id: ${req.params.id}`, 404));
  }
  deleted.remove();
  res.status(200).json({
    success: true,
    data: {}
  })
})