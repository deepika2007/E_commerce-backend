const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const crypto = require('crypto')

const LoginSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is Required.'],
    unique: [true, 'Email should be unique'],
    validate(value) {
      if (!validator.isEmail(value)) { throw new Error('Invalid email') }
    }
  },
  password: {
    type: String,
    required: [true, 'Password is Required.'],
  },
  role: {
    type: String,
    default: 'user',
  },
  resetPasswordToken: String,
  resetPasswordExpire: String
})

// for password
LoginSchema.pre('save', async function (next) {
  if (!this.isModified('password')) { next() }
  this.password = await bcrypt.hash(this.password, 10)
})

// JWT TOKEN
LoginSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE_IN })
}

// Compare password
LoginSchema.methods.comparePassword = async function (enterPassword) {
  const password = await bcrypt.hash(enterPassword, 10)
  return await bcrypt.compare(password, this.password)
}

//Generating Password Reset Token 
LoginSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString('hex');
  this.resetPasswordToken = crypto
    .createHash("sha256") //algo for pattern
    .update(resetToken)
    .digest('hex')

  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000
  return resetToken;
}
module.exports = new mongoose.model('User', LoginSchema);