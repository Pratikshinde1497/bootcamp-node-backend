const asyncHandler = require('../middlewares/async');
const ErrorResponce = require('../utils/errorResponce');
const jwt = require('jsonwebtoken');
const User = require('../models/User')

//  Protect routes
exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  // get token from header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  //  check if token exists
  if(!token) {
    return next(new ErrorResponce(`not authorized to access the resource`, 401));
  }

  //  decode token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    //  set user 
    req.user = await User.findById(decoded.id);
    
    next();
  } catch (err) {
    return next(new ErrorResponce(`not authorized to access`, 401));
  }
})

//  Grant access to certain roles only
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new ErrorResponce(`user with ${req.user.role} role not authorized to access`, 403));
    }
    next();
  }
} 