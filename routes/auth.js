const express = require('express');
const { registerUser, loginUser, getMe } = require('../controllers/auth');
const router = express();
const { protect } = require('../middlewares/auth')
//  routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);


module.exports = router;