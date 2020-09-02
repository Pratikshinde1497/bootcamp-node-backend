const Bootcamp = require('../models/Bootcamp');
const ErrorResponce = require('../utils/errorResponce');
const asyncHandler = require('../middlewares/async');

// @desc      Get all bootcamps
// @route     GET /api/v1/bootcamps
// @access    Pubic
exports.getBootcamps = asyncHandler(async (req, res, next) => {
    const bootcamps = await Bootcamp.find();
    if (!bootcamps) {
      next(new ErrorResponce(`no bootcamps found`, 404))
    } else {
      res.status(200).json({
        success: true,
        count: bootcamps.length,
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
    const deleted = await Bootcamp.findByIdAndDelete(req.params.id);
    if (!deleted) {
      next(new ErrorResponce(`bootcamp not found with id: ${req.params.id}`, 404));
    }
    else {
      res.status(200).json({
        success: true,
        data: deleted
      })
    }
})



