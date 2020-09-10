const express = require('express');
const { registerUser, loginUser, getMe, updateDetails, updatePassword, forgotpassword, resetPassword } = require('../controllers/auth');
const router = express();
const { protect } = require('../middlewares/auth')
//  routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);
router.put('/updatedetails', protect, updateDetails);
router.put('/updatepassword', protect, updatePassword);
router.post('/forgotpassword', forgotpassword);
router.put('/resetpassword/:resettoken', resetPassword);


module.exports = router;