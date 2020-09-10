const asyncHandler = require("../middlewares/async");
const crypto = require('crypto');
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

  //  give response
  sendResponse(user, 200, res);
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
  //  give response
  sendResponse(user, 200, res);
})

// @desc      Get loggedIn user
// @route     GET /api/v1/auth/me
// @access    Private
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await req.user

  res.status(200).json({
    success: true,
    data: user
  })
})

// @desc      Update user details
// @route     PUT /api/v1/auth/updatedetails
// @access    Private
exports.updateDetails = asyncHandler(async (req, res, next) => {
  //  get data to update from body
  const updateFields = {
    email: req.body.email,
    name: req.body.name
  }
  //  make changes in db
  const user = await User.findByIdAndUpdate(req.user.id, updateFields, { validateBeforeSave: true, new: true});
  if(!user) {
    return next(new ErrorResponce(`no user found with id: ${req.user.id}`, 400));
  }
  
  res.status(200).json({
    success: true,
    data: user
  })
})

// @desc      Update user password
// @route     PUT /api/v1/auth/updatepassword
// @access    Private
exports.updatePassword = asyncHandler(async (req, res, next) => {
  //  get user details
  const user = await User.findById(req.user.id).select('+password');
  if(!user) {
    return next(new ErrorResponce(`no user found with id: ${req.user.id}`, 400));
  }
  if(!(await user.matchPassword(req.body.currentPassword))) {
    return next(new ErrorResponce(`Invalid credentials`, 400));
  }
  user.password = req.body.newPassword;
  //  save new password
  await user.save({validateBeforeSave: true});

  sendResponse(user, 200, res);
})

// @desc      Forgot password
// @route     POST /api/v1/auth/forgotpassword
// @access    Public
exports.forgotpassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  //  if no user
  if(!user) {
    return next(new ErrorResponce(`no user with that email found`, 404));
  }
  //  get reset token from model
  const resetToken = user.getPasswordResetToken();
  //  save token and expire time in db
  await user.save({ validateBeforeSave: false });
  //  create reset url
  const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/resetpassword/${resetToken}`;
  //  create mail message
  const message = `you are getting this mail because you (or someone else) has requested to reset 
  password of DEV-CAMPER site account, please make PUT request to \n\n ${resetUrl} \n\n Thank you!`;

  try {
    // await sendMail({
    //   email: user.email,
    //   subject: 'reset password',
    //   message
    // });
    //  give response 
    res.status(200).json({
      success: true,
      data: {
          email: user.email,
          subject: 'reset password',
          message
        }
    })
  } catch (err) {
    return next(new ErrorResponce(`error while sending mail`, 500))
  }
})


// @desc      Reset Password
// @route     GET /api/v1/auth/resetpassword/:resettoken
// @access    Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
  const resetPasswordToken = crypto.createHash('sha256').update(req.params.resettoken).digest('hex');
  //  find user with same reset token and expire time greater
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() }
  });
  //  not found
  if (!user) {
    return next(new ErrorResponce(`Invalid token`, 400))
  }

  //  make changes
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  user.password = req.body.password;
  //  save entry
  await user.save();

  sendResponse(user, 200, res);
})

// @desc      Helper function to send response
const sendResponse = (user, statusCode, res) => {
  //  get Token
  const token = user.getSignedJWTToken();
  //  set cookie options
  const options = {
    expires: new Date( Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
    httpOnly: true
  }
  if(process.env.NODE_ENV === 'production') {
    options.secure = true
  }
  //  send response
  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      token
  })
}