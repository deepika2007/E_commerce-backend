const express = require('express');
const router = express.Router()
const { registerUser, allUsers, loginUser, logout, forgotPassword, resetPassword, profileDetails, updatePassword } = require('../controllers/authlogin');
const { isAuthenticatedUser, authorizeRole } = require('../utils/authCheck');

// login
router.route('/register').post(registerUser)
router.route('/users').get(isAuthenticatedUser, authorizeRole('admin'), allUsers)
router.route('/login').post(loginUser)
router.route('/profile').get(isAuthenticatedUser, profileDetails)
router.route('/logout').get(isAuthenticatedUser, logout);
router.route('/password/forgot').post(forgotPassword);
router.route('/password/reset/:token').put(resetPassword);
router.route('/password/update').put(isAuthenticatedUser, updatePassword);

module.exports = router