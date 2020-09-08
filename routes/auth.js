const express = require('express');
const { registerUser } = require('../controllers/auth');
const router = express();

//  routes
router.post('/register', registerUser);

module.exports = router;