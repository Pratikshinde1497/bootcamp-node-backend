const Bootcamp = require('../models/Bootcamp');
const ErrorResponce = require('../utils/errorResponce');
const asyncHandler = require('../middlewares/async');
const GeoCoder = require('../utils/geoCoder');

// @desc      Get all bootcamps
// @route     GET /api/v1/bootcamps
// @access    Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
    res.status(200).json(res.advancedResponce);
})

// @desc      Get a bootcamp
// @route     GET /api/v1/bootcamps/:id
// @access    Public
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
  req.body.user = req.user.id;
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
  
  //  check for the bootcamp
  const bootcamp = await Bootcamp.findById(req.params.id);
  if(!bootcamp)
    return next(new ErrorResponce(`bootcamp not found with id: ${req.params.id}`, 404));

  //  check if bootcamp user, is the one who is making changes 
  if (bootcamp.user != req.user.id && req.user.role !== 'admin')  {
    return next(new ErrorResponce(`${req.user.name} not authorized to update bootcamp: ${bootcamp.id}`, 403));
  }

  //  update
  const updated = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true});  
  res.status(200).json({
    success: true,
    data: updated
  })
})

// @desc      Delete a bootcamp
// @route     DELETE /api/v1/bootcamps/:id
// @access    Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
    
  //  check for the bootcamp
  const bootcamp = await Bootcamp.findById(req.params.id);
  if(!bootcamp)
    return next(new ErrorResponce(`bootcamp not found with id: ${req.params.id}`, 404));

  //  check if bootcamp user, is the one who is making changes 
  if (bootcamp.user != req.user.id && req.user.role !== 'admin')  {
    return next(new ErrorResponce(`${req.user.name} not authorized delete bootcamp: ${bootcamp.id}`, 403));
  }

  //  apply changes
  await bootcamp.remove();
  res.status(200).json({
    success: true,
    data: {}
  })
})

// @desc      Get bootcamps within radius
// @route     GET /api/v1/bootcamps/radius/:zipcode/:distance
// @access    Public
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
