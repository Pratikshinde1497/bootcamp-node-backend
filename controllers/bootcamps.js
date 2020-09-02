const Bootcamp = require('../models/Bootcamp');

// @desc      Get all bootcamps
// @route     GET /api/v1/bootcamps
// @access    Pubic
exports.getBootcamps = async (req, res, next) => {
  try {
    const bootcamps = await Bootcamp.find();
    res.status(200).json({
      success: true,
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
    res.status(404).json({
      success: false,
      error
    })
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
    res.status(400).json({
      success: false,
      error
    })
  }
}

// @desc      Update a bootcamp
// @route     PUT /api/v1/bootcamps/:id
// @access    Private
exports.updateBootcamp = async (req, res, next) => {
  try {
    const updated = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true});
    if (!updated) {
      res.status(400).json({
        success:false,
      })
    }
    else {
      res.status(200).json({
        success: true,
        data: updated
      })
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      error
    })
  }
}

// @desc      Delete a bootcamp
// @route     DELETE /api/v1/bootcamps/:id
// @access    Private
exports.deleteBootcamp = async (req, res, next) => {
  try {
    const deleted = await Bootcamp.findByIdAndDelete(req.params.id);
    if (!deleted) {
      res.status(400).json({
        success: false
      })
    }
    else {
      res.status(200).json({
        success: true,
        data: deleted
      })
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      error
    })
  }
}



