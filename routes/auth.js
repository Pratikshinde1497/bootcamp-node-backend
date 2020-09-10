const express = require('express');
const { registerUser, loginUser, getMe, forgotpassword, resetPassword } = require('../controllers/auth');
const router = express();
const { protect } = require('../middlewares/auth')
//  routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);
router.post('/forgotpassword', forgotpassword);
router.put('/resetpassword/:resettoken', resetPassword);


module.exports = router;