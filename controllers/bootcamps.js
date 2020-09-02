const Bootcamp = require('../models/Bootcamp');
const ErrorResponce = require('../utils/errorResponce');

// @desc      Get all bootcamps
// @route     GET /api/v1/bootcamps
// @access    Pubic
exports.getBootcamps = async (req, res, next) => {
  try {
    const bootcamps = await Bootcamp.find();
    res.status(200).json({
      success: true,
      count: bootcamps.length,
      data: bootcamps
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error
    })
  }
}

// @desc      Get a bootcamp
// @route     GET /api/v1/bootcamps/:id
// @access    Pubic
exports.getBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findById(req.params.id);
    res.status(200).json({
      success: true,
      data: bootcamp
    })
  } catch (error) {
    next(new ErrorResponce(`bootcamp not found with id ${req.params.id}`, 404));
  }
}

// @desc      Add new bootcamp
// @route     POST /api/v1/bootcamps
// @access    Private
exports.pushBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.create(req.body);
    res.status(201).json({
      success: true,
      data: bootcamp
    })
  } catch (error) {
    next(new ErrorResponce(`bootcamp not created`, 400));
  }
}

// @desc      Update a bootcamp
// @route     PUT /api/v1/bootcamps/:id
// @access    Private
exports.updateBootcamp = async (req, res, next) => {
  try {
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
  } catch (error) {
    next(new ErrorResponce(`bootcamp not updated`, 400));
  }
}

// @desc      Delete a bootcamp
// @route     DELETE /api/v1/bootcamps/:id
// @access    Private
exports.deleteBootcamp = async (req, res, next) => {
  try {
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
  } catch (error) {
    next(new ErrorResponce(`bootcamp not deleted`, 400));
  }
}



