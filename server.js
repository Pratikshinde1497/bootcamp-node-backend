const express = require("express");
const dotenv = require("dotenv");
const mongoSanitize = require('express-mongo-sanitize');

const auth = require('./routes/auth');
const bootcamps = require("./routes/bootcamps");
const courses = require("./routes/courses");
const users = require("./routes/users");
const reviews = require("./routes/reviews");

const morgan = require('morgan');
const connectDB = require('./config/database');
const colors = require('colors');
const errorHandler = require('./middlewares/error');

//  configure dotenv
dotenv.config({ path: './config/config.env' });

//  connect to database
connectDB();

//  instantiate express
const app = express();

//  use body parser to get data laying in request
app.use(express.json());

//  sanitize data to prevent NO-SQL injection
app.use(mongoSanitize());

//  use morgan only if we are running in development mode
if(process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

//  load routes
app.use('/api/v1/auth', auth);
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);
app.use('/api/v1/users', users);
app.use('/api/v1/reviews', reviews);

// handle errors using middleware
app.use(errorHandler);

//  post number
const PORT = process.env.PORT || 5000;

//  start server on given port
const server = app.listen(PORT, () => console.log(`Server runnig in ${process.env.NODE_ENV} mode on ${PORT}`.yellow.bold));

//  handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  //  log the error
  console.log(`Error: ${err.message}`.red);
  //  close server
  server.close(() => process.exit(1));
})