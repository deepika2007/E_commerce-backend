const ErrorHandler = require("./ErrorHandler")
const jwt = require('jsonwebtoken');
const login = require("../models/authlogin");
const { RequestFailure } = require("./Status");

// verify token
exports.isAuthenticatedUser = async (req, res, next) => {
  try {
    const { token } = req.cookies
    if (!token) {
      return RequestFailure(res, 401, { message: 'Please login for token resource' })
    }
    const decodeData = jwt.verify(token, process.env.JWT_SECRET)
    req.user = await login.findById(decodeData.id)
    next()
  } catch (e) { RequestFailure(res, 500, e.message||'Bad request') }
}


// check role and give access 
exports.authorizeRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user?.role)) RequestFailure(res, 403, { message: `Role : ${req.user.role} is not allowed to accress.` })
    next()
  }
}