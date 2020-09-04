const colors = require('colors');
const fs = require('fs');
const mongoose = require('mongoose');
require('dotenv').config({path: './config/config.env'});

//  load model
const Bootcamp = require('./models/Bootcamp');
const Course = require('./models/Course');

//  connect to db
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useCreateIndex:true,
  useFindAndModify: false,
  useUnifiedTopology: true 
});


//  Read json files 
const bootcamps = JSON.parse(fs.readFileSync(`${__dirname}/_data/bootcamps.json`, 'utf-8'));
const courses = JSON.parse(fs.readFileSync(`${__dirname}/_data/courses.json`, 'utf-8'));


//  imports all data in file
const importData = async () => {
  try {
    await Bootcamp.create(bootcamps);
    await Course.create(courses);

    console.log("imported data".green.inverse);
    process.exit();
  } catch (err) {
    console.error(err);
  }
}

//  delete all data
const deleteData = async () => {
  try {
    await Bootcamp.deleteMany();
    await Course.deleteMany();
    
    console.log("deleted data".red.inverse);
    process.exit();
  } catch (err) {
    console.error(err);
  }
}


//  check command
if (process.argv[2] === '-i') {
  importData();
} else if(process.argv[2] === '-d') {
  deleteData();
} else {
  console.log('sorry, seeder unable to understand');
}