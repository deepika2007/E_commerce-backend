const express = require('express');
const router = express.Router()
const { registerUser, userData, usersData } = require('../controllers/authlogin');

router.route('/login').post(registerUser)
router.route('/user').get(userData)
router.route('/users').get(usersData)

module.exports = router