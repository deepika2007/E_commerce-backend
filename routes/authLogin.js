const express = require('express');
const router = express.Router()
const { registerUser, allUsers, loginUser, logout, forgotPassword, resetPassword, profileDetails, updatePassword,singleUser,deleteUser } = require('../controllers/authlogin');
const { isAuthenticatedUser, authorizeRole } = require('../utils/authCheck');

// login
router.route('/register').post(registerUser) //register
router.route('/login').post(loginUser) //login
router.route('/profile').get(isAuthenticatedUser, profileDetails) //user data
router.route('/password/forgot').post(forgotPassword); // forgot password
router.route('/password/reset/:token').put(resetPassword); // reset passowrd
router.route('/logout').get(isAuthenticatedUser, logout); // logout
router.route('/admin/users').get(isAuthenticatedUser, authorizeRole('admin'), allUsers) // all user data for admin
router.route('/password/update').put(isAuthenticatedUser, updatePassword); //don't use right now
router.route('/admin/user/:id').get(isAuthenticatedUser, authorizeRole('admin'), singleUser).delete(isAuthenticatedUser, authorizeRole('admin'), deleteUser) //get user data and delete user

module.exports = router

// const express = require('express');
// const router = express.Router()
// const { registerUser, allUsers, loginUser, logout, forgotPassword, singleUser, resetPassword, updatePassword, profileDetails, profileUpdate, deleteUser } = require('../Controllers/login');
// const { isAuthenticatedUser, authorizeRole } = require('../utils/authCheck');

// // login
// router.route('/register').post(registerUser)
// router.route('/login').post(loginUser)
// router.route('/profile').get(isAuthenticatedUser, profileDetails).put(isAuthenticatedUser, profileUpdate);
// router.route('/password/forgot').post(forgotPassword);
// router.route('/password/reset/:token').put(resetPassword);
// router.route('/password/update').put(isAuthenticatedUser, updatePassword);
// router.route('/logout').get(logout);
// router.route('/admin/users').get(isAuthenticatedUser, authorizeRole('admin'), allUsers)
// router.route('/admin/user/:id').get(isAuthenticatedUser, authorizeRole('admin'), singleUser).delete(isAuthenticatedUser, authorizeRole('admin'), deleteUser)

// module.exports = router
