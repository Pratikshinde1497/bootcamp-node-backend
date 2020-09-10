const cryto = require('crypto');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'please, add your name'],
  },
  email: {
    type: String,
    required: [true, 'please, add your email address'],
    match: [
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      'enter valid email'
    ],
    unique: true
  },
  role: {
    type: String,
    enum: ['user', 'publisher'],
    default: 'user'
  },
  password: {
    type: String,
    required: [true, 'please add your password'],
    minlength: 6,
    select: false
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
})

//  Encrypt password using bcryptjs
UserSchema.pre('save', async function(next) {
  if(!this.isModified('password')) {
    next();
  }
  //  execute only if password field is modified
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
})

//  Add Method which will give us the jwt signed token
UserSchema.methods.getSignedJWTToken = function() {
  return jwt.sign(
      { id: this._id }, 
      process.env.JWT_SECRET, 
      { expiresIn: process.env.JWT_EXPIRE }
    );
}

//  generate ang hash password token
UserSchema.methods.getPasswordResetToken = function() {
  //  generate token
  const resetToken = cryto.randomBytes(20).toString('hex');
  //  hash token and set resetPasswordToken field
  this.resetPasswordToken = cryto.createHash('sha256').update(resetToken).digest('hex');
  //  set token expire time : 10min
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
  return resetToken;
}

//  add method to compare passwords
UserSchema.methods.matchPassword = async function(givenPass) {
  return await bcrypt.compare(givenPass, this.password);
}

module.exports = mongoose.model('User', UserSchema);