// @desc      Get all bootcamps
// @route     GET /api/v1/bootcamps
// @access    Pubic
exports.getBootcamps = (req, res, next) => {
  res.json({
    success: true,
    data: "all bootcamps"
  })
}

// @desc      Get a bootcamp
// @route     GET /api/v1/bootcamps/:id
// @access    Pubic
exports.getBootcamp = (req, res, next) => {
  res.json({
    success: true,
    data: `fetched ${req.params.id}`
  })
}

// @desc      Add new bootcamp
// @route     POST /api/v1/bootcamps
// @access    Private
exports.pushBootcamp = (req, res, next) => {
  res.json({
    success: true,
    data: "pushed !"
  })
}

// @desc      Update a bootcamp
// @route     PUT /api/v1/bootcamps/:id
// @access    Private
exports.updateBootcamp = (req, res, next) => {
  res.json({
    success: true,
    data: `updated! ${req.params.id}`
  })
}

// @desc      Delete a bootcamp
// @route     DELETE /api/v1/bootcamps/:id
// @access    Private
exports.deleteBootcamp = (req, res, next) => {
  res.json({
    success: true,
    data: `deleted! ${req.params.id}`
  })
}



