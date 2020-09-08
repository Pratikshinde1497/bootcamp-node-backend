const asyncHandler = require("../middlewares/async");
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

  const token = user.getSignedJWTToken();

  res.status(200).json({
    success: true,
    token
  })
})