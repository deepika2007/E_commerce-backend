const { RequestSuccess, RequestFailure } = require('../utils/Status')
const dotenv = require('dotenv'); //env variables
dotenv.config();
const crypto = require('crypto')
const login = require('../models/authlogin');
const sendToken = require('../utils/sendToken');
const sendEmail = require('../utils/sendEmail.js');


// register 
exports.registerUser = async (req, res, next) => {
  const { email, password } = req.body
  if (!email || !password) RequestFailure(res, 400, 'Enter email and password')

  const userData = new login({ email, password })

  await userData.save().then(createBlog => {
    if (!createBlog) RequestFailure(res, 400, err?.message || 'Bad request')
    sendToken(createBlog, 201, res)
  }).catch(err => RequestFailure(res, 400, err?.message || 'Bad request'))
}



// all users(admin)
exports.allUsers = async (req, res, next) => {
  await login.find().then(data => {
    if (!data) RequestFailure(res, 404, 'Users not found')
    RequestSuccess(res, 200, data)
  }).catch((err) => RequestFailure(res, 404, err?.message || 'Bad request'));
}



// single user data(login)
exports.loginUser = async (req, res, next) => {
  await login.findOne({ email: req.body.email }).then(async (user) => {
    if (!user) RequestFailure(res, 404, 'User not found')
    const result = await user.comparePassword(req.body?.password)
    if (!result) RequestFailure(res, 404, 'Invalid email or password')
    sendToken(user, 201, res)
  }).catch((e) => RequestFailure(res, 500, e?.message || 'Bad request'))
}

// profile 
exports.profileDetails = async (req, res, next) => {
  await login.findById(req.user.id).then((user) => {
    if (!user) RequestFailure(res, 404, 'User not found')
    RequestSuccess(res, 200, user)
  }).catch((e) => RequestFailure(res, 500, e?.message || 'Bad request'))
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
          subject: `Products password Recovery`,
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
    if (!isPasswordMatched) RequestFailure(res, 400, 'Old password is incorrect')
    else if (req.body?.newPassword !== req.body?.confirmPassword) RequestFailure(res, 400, "Password doesn't match.")
    user.password = req.body?.newPassword
    await user.save();
  }).catch((e) => RequestFailure(res, 500, e?.message || 'Bad request'))
}
