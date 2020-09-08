const asyncHandler = require("../middlewares/async");
const ErrorResponce = require('../utils/errorResponce');
const User = require('../models/User');

// @desc      Register user
// @route     POST /api/v1/auth/register
// @access    Public
exports.registerUser = asyncHandler(async (req, res, next) => {
  const { name, password, email, role } = req.body;
  const user = await User.create({
    name,
    email,
    password,
    role
  });

  //  get Token
  const token = user.getSignedJWTToken();

  res.status(200).json({
    success: true,
    token
  })
})

// @desc      Login user
// @route     POST /api/v1/auth/login
// @access    Public
exports.loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  
  //  if no data provided
  if(!email || !password) {
    return next(new ErrorResponce(`please provide an email and password`, 400));
  }

  //  check user
  const user = await User.findOne({ email }).select('+password');
  if(!user) {
    return next(new ErrorResponce(`Invalid Credentials`, 401));
  }

  //  check if password matches
  const isMatch = await user.matchPassword(password);
  if(!isMatch) {
    return next(new ErrorResponce(`Invalid Credentials`, 401));
  }

  //  get Token
  const token = user.getSignedJWTToken();

  res.status(200).json({
    success: true,
    token
  })
})