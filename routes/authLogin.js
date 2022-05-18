const express = require('express');
const router = express.Router()
const { registerUser, allUsers, loginUser, logout, forgotPassword, resetPassword, profileDetails, updatePassword } = require('../controllers/authlogin');
const { isAuthenticatedUser, authorizeRole } = require('../utils/authCheck');

// login
router.route('/register').post(registerUser) //register
router.route('/login').post(loginUser) //login
router.route('/profile').get(isAuthenticatedUser, profileDetails) //user data
router.route('/password/forgot').post(forgotPassword); // forgot password
router.route('/password/reset/:token').put(resetPassword); // reset passowrd
router.route('/logout').get(isAuthenticatedUser, logout); // logout
router.route('/users').get(isAuthenticatedUser, authorizeRole('admin'), allUsers) // all user data for admin
router.route('/password/update').put(isAuthenticatedUser, updatePassword); //don't use right now



module.exports = router