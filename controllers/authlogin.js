const { RequestSuccess, RequestFailure } = require('../utils/Status')
const dotenv = require('dotenv'); //env variables
dotenv.config();
const crypto = require('crypto')
const login = require('../models/authlogin');
const sendToken = require('../utils/sendToken');
const sendEmail = require('../utils/sendEmail.js');

// register 
exports.registerUser = async (req, res, next) => {
  try {
    const { email, password } = req.body
    if (!email || !password) RequestFailure(res, 400, 'Enter email and password')
    else {
      const userData = new login({ email, password })
      await userData.save().exec((err, user) => {
        if (err) RequestFailure(res, 400, err?.message || 'Bad request')
        else if (user) sendToken(user, 201, res)
      })
    }
  } catch (err) { RequestFailure(res, 400, err?.message || 'Bad request') }
}

// single user data(login)
exports.loginUser = async (req, res, next) => {
  await login.findOne({ email: req.body.email }).exec(async (err, user) => {
    if (err) RequestFailure(res, 500, err.message || 'Bad request')
    if (user) {
      const result = await user.comparePassword(req.body?.password)
      if (!result) RequestFailure(res, 404, 'Invalid email or password')
      else sendToken(user, 201, res)
    }
  })
}

// profile (user)
exports.profileDetails = async (req, res, next) => {
  await login.findById(req.user.id, 'email role _id').exec(async (err, user) => {
    if (err) RequestFailure(res, 500, err?.message || 'Bad request')
    if (!user) RequestFailure(res, 404, 'User not found')
    else RequestSuccess(res, 200, user)
  })
}

// profile  update(user)
exports.profileUpdate = async (req, res, next) => {
  await login.findById(req.user.id).exec(async (err, user) => {
    if (err) RequestFailure(res, 500, err?.message || 'Bad request')
    if (!user) RequestFailure(res, 404, 'User not found')
    else await login.findByIdAndUpdate(req.user.id, req.body, { new: true }).select({ 'password': 0, '__v': 0 }).then(updateUser => {
      if (!updateUser) { RequestFailure(res, 404, 'User not updated !') }
      else RequestSuccess(res, 200, updateUser)
    })
  })
}

// logout user
exports.logout = (req, res, next) => {
  try {
    res.cookie('token', null, {
      expires: new Date(Date.now()),
      httpOnly: true
    })
    RequestSuccess(res, 200, { message: 'Logged out' })
  } catch (e) { RequestFailure(res, 500, e?.message || 'Bad request') }
}

//  Forget Password
exports.forgotPassword = async (req, res, next) => {
  try {
    await login.findOne({ email: req.body.email }).then(async (user) => {
      if (!user) RequestFailure(res, 404, 'User not found')

      // Get ResetPassword Token
      const resetToken = user.getResetPasswordToken();
      await user.save({ validateBeforeState: false })
      const resetPasswordUrl = `${req.protocol}://${req.get('host')}/auth/password/reset/${resetToken}`
      const message = `Your password rest token is :- \n\n ${resetPasswordUrl} \n\n if you have not requested this email then , please ignore it.`

      try {
        await sendEmail.sendEmail({
          email: user.email,
          subject: `Product password Recovery`,
          message
        })
        RequestSuccess(res, 200, { message: `Email send to ${user?.email} successfully ` })

      } catch (err) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeState: false })
        RequestFailure(res, 500, err?.message || 'Bad request')
      }
    })
  } catch (e) { RequestFailure(res, 500, e?.message || 'Bad request') }
}

//  Reset Password
exports.resetPassword = async (req, res, next) => {
  try {
    const resetPasswordToken = crypto
      .createHash("sha256") //algo for pattern
      .update(req.params.token)
      .digest('hex')

    const user = await login.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    });
    if (!user) RequestFailure(res, 404, 'Reset password token is invalid or has been expired')
    if (req.body.password != req.body.confirmPassword) RequestFailure(res, 400, 'Password does not matched')
    user.password = req.body.password
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save()
    sendToken(user, 200, res)

  } catch (e) { RequestFailure(res, 500, e?.message || 'Bad request') }
}

// update password (old ,new ,confirm password)
exports.updatePassword = async (req, res, next) => {
  await login.findById(req.user.id).then(async (user) => {
    if (!user) RequestFailure(res, 404, 'User not found')
    const isPasswordMatched = await user.comparePassword(req.body.oldPassword)
    console.log(req.body.oldPassword, isPasswordMatched)
    if (!isPasswordMatched) RequestFailure(res, 400, 'Old password is incorrect')
    else if (req.body?.newPassword !== req.body?.confirmPassword) RequestFailure(res, 400, "Password doesn't match.")
    else user.password = req.body?.newPassword
    await user.save();
  }).catch((e) => RequestFailure(res, 500, e?.message || 'Bad request'))
}

// apis for admin

// all users (admin)
exports.allUsers = async (req, res, next) => {
  await login.find().select('email role _id').then(data => {
    if (!data) RequestFailure(res, 404, 'Users not found')
    else RequestSuccess(res, 200, data)
  }).catch((err) => RequestFailure(res, 404, err?.message || 'Bad request'));
}

// single user Data (admin)
exports.singleUser = async (req, res, next) => {
  await login.findById(req.params.id,'email role _id').then(data => {
    if (!data) RequestFailure(res, 404, 'User not found')
    else RequestSuccess(res, 200, data)
  }).catch((err) => RequestFailure(res, 404, err?.message || 'Bad request'));
}

// delete user only for admin
exports.deleteUser = async (req, res, next) => {
  await login.findById(req.params.id).then(async (user) => {
    if (!user) RequestFailure(res, 404, 'User not found')
    await login.findByIdAndDelete(req.params.id).then(updateUser => {
      if (!updateUser) { RequestFailure(res, 404, 'User not updated !') }
      RequestSuccess(res, 200, { message: `${updateUser.email} deleted successfully !` })
    })
  }).catch((e) => RequestFailure(res, 500, e?.message || 'Bad request'))
}

// google login
// exports.google = async (req, res, next) => {

// }
