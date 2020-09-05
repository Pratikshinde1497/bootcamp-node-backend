const Bootcamp = require('../models/Bootcamp');
const ErrorResponce = require('../utils/errorResponce');
const asyncHandler = require('../middlewares/async');
const GeoCoder = require('../utils/geoCoder');

// @desc      Get all bootcamps
// @route     GET /api/v1/bootcamps
// @access    Pubic
exports.getBootcamps = asyncHandler(async (req, res, next) => {

  let query, selectedFields, sortingFields; 
  //  copy req.query 
  const reqQuery = {...req.query };
  //  fields to exclude from query string because they are not supported by default, we are mutating it
  const removeFields = ['select', 'sort', 'page', 'limit'];
  //  remove removeFields from reqQuery
  removeFields.forEach(val => delete reqQuery[val]);
  //  create query
  let queryStr = JSON.stringify(reqQuery);
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match=> `$${match}`);
  //  get resources from db
  query = Bootcamp.find(JSON.parse(queryStr)).populate('courses');

  //  select: fields
  if (req.query.select) {
    selectedFields = req.query.select.replace(/,/g, ' ');
    query = query.select(selectedFields);
  }

  //  sort: data
  if (req.query.sort) {
    sortingFields = req.query.sort.replace(/,/g, ' ');
    query = query.sort(sortingFields);
  }
  else 
    query = query.sort('-createdAt');

  //  Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20; 
  const startIndex = (page-1) * limit;
  const endIndex = page * limit;
  const total = Bootcamp.countDocuments();

  query = query.skip(startIndex).limit(limit);

  const bootcamps = await query;
  if (!bootcamps) {
    next(new ErrorResponce(`no bootcamps found`, 404))
  } else {

    let pagination = {};
    if(startIndex>0) {
      pagination.prev = {
        page: page - 1,
        limit
      }
    }
    if(endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit
      }
    }

    res.status(200).json({
      success: true,
      count: bootcamps.length,
      pagination,
      data: bootcamps
    })
  }
})

// @desc      Get a bootcamp
// @route     GET /api/v1/bootcamps/:id
// @access    Pubic
exports.getBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id);
    if(!bootcamp) {
      next(new ErrorResponce(`no bootcamp found`, 404))
    }
    else {
      res.status(200).json({
        success: true,
        data: bootcamp
      })
    }
})

// @desc      Add new bootcamp
// @route     POST /api/v1/bootcamps
// @access    Private
exports.pushBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.create(req.body);
    res.status(201).json({
      success: true,
      data: bootcamp
    })
})

// @desc      Update a bootcamp
// @route     PUT /api/v1/bootcamps/:id
// @access    Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
    const updated = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true});
    if (!updated) {    
      next(new ErrorResponce(`bootcamp not found with id: ${req.params.id}`, 404));
    }
    else {
      res.status(200).json({
        success: true,
        data: updated
      })
    }
})

// @desc      Delete a bootcamp
// @route     DELETE /api/v1/bootcamps/:id
// @access    Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
    const deleted = await Bootcamp.findById(req.params.id);
    if (!deleted) {
      next(new ErrorResponce(`bootcamp not found with id: ${req.params.id}`, 404));
    }
    else {
      deleted.remove();
      res.status(200).json({
        success: true,
        data: deleted
      })
    }
})

// @desc      Get bootcamps within radius
// @route     GET /api/v1/bootcamps/radius/:zipcode/:distance
// @access    Private
exports.getBootcampsByRadius = asyncHandler(async (req, res, next)  => {
  const { zipcode, distance } = req.params;

  //  get location from geocoder
  const loc = await GeoCoder.geocode(zipcode);
  const lat = loc[0].latitude;
  const lng = loc[0].longitude;
  
  //  calculate radius of earth     3,963 mi  /   6,378 km
  const radius = distance/6378;

  // find the bottcamps within radius of zipcode area
  const Bootcamps = await Bootcamp.find({
    location: {
      $geoWithin: {
        $centerSphere: [[lng, lat], radius]
      }
    }
  })

  //  send to user
  res.status(200).json({
    success: true,
    count: Bootcamps.length,
    data: Bootcamps
  })
})

