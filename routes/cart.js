const express = require('express');
const { getCart, addCart, deleteCart } = require('../controllers/cart');
const { isAuthenticatedUser,authorizeRole } = require('../utils/authCheck');
const router = express.Router();

router.route('/').get(isAuthenticatedUser, getCart).post(isAuthenticatedUser, addCart);
router.route('/:id').delete(isAuthenticatedUser, deleteCart)

module.exports = router