const asyncHandler = require('../middlewares/async');
const User = require('../models/User');
const ErrorResponce = require('../utils/errorResponce');

// @desc      Get all users
// @route     GET /api/v1/users
// @access    Private
exports.getUsers = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResponce);
})

// @desc      Get a user
// @route     GET /api/v1/users/:id
// @access    Private
exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if(!user) {
    next(new ErrorResponce(`no user found`, 404))
  }
  else {
    res.status(200).json({
      success: true,
      data: user
    })
  }
})

// @desc      Update a user
// @route     PUT /api/v1/users/:id
// @access    Private
exports.updateUser = asyncHandler(async (req, res, next) => {
  const updated = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true});
  if (!updated) {    
    next(new ErrorResponce(`user not found with id: ${req.params.id}`, 404));
  }
  else {
    res.status(200).json({
      success: true,
      data: updated
    })
  }
})

// @desc      Delete a user
// @route     DELETE /api/v1/users/:id
// @access    Private
exports.deleteUser = asyncHandler(async (req, res, next) => {
  const deleted = await User.findById(req.params.id);
  if (!deleted) {
    next(new ErrorResponce(`user not found with id: ${req.params.id}`, 404));
  }
  else {
    deleted.remove();
    res.status(200).json({
      success: true,
      data: delete{}
    })
  }
})