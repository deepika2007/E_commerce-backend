const express = require('express');
const { addToWishlist, getWishlist, deleteWishlist,getAllWishlist } = require('../controllers/wishlist');
const { isAuthenticatedUser,authorizeRole } = require('../utils/authCheck');
const router = express.Router()

router.route('/').get(isAuthenticatedUser, getWishlist)
router.route('/:id').post(isAuthenticatedUser, addToWishlist).delete(isAuthenticatedUser, deleteWishlist)
router.route('/admin').get(isAuthenticatedUser, authorizeRole('admin'), getAllWishlist)

module.exports = router