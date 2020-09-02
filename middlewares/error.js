const ErrorResponce = require("../utils/errorResponce");

const errorHandler = (err, req, res, next) => {

  let error = { ...err }
  // console.log(err);
  error.message = err.message;

  //  mongoose bad objectId
  if(err.name === 'CastError') {
    const message = `Resource not found --invalid id: ${err.value}`;
    error = new ErrorResponce(message, 400);
  }

  //  mongoose duplicate value 
  if(err.code === 11000) {
    const message = `Duplicate value provided`;
    error = new ErrorResponce(message, 400);
  }

  //  mongoose validation error
  if(err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(e => e.message);
    error = new ErrorResponce(message, 400);
  }

  //  send error to user
  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error'
  })
}

module.exports = errorHandler;