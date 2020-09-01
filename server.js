const express = require("express");
const dotenv = require("dotenv");
const bootcamps = require("./routes/bootcamps");
const morgan = require('morgan');
const connectDB = require('./config/database');
//  configure dotenv
dotenv.config({ path: './config/config.env' });

//  connect to database
connectDB();

//  instantiate express
const app = express();

//  use morgan only if we are running in development mode
if(process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

//  goto bootcamps route
app.use('/api/v1/bootcamps', bootcamps)

//  post number
const PORT = process.env.PORT || 5000;

//  start server on given port
const server = app.listen(PORT, () => console.log(`Server runnig in ${process.env.NODE_ENV} mode on ${PORT}`));

//  handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  //  log the error
  console.log(`Error: ${err.message}`);
  //  close server
  server.close(() => process.exit(1));
})