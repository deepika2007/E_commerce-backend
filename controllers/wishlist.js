const Wishlist = require('../models/wishlist');
const { RequestSuccess, RequestFailure } = require('../utils/Status');

exports.addToWishlist = async (req, res, next) => {
  try {
    if (!req.params.id) RequestFailure(res, 400, 'Bad request')
    else {
      await Wishlist.findOne({ product: req.params.id }).exec(async (err, data) => {
        if (err) RequestFailure(res, 500, err.message);
        if (data?.isDeleted) {
          data.isDeleted = false;
          data.save().then(() => RequestSuccess(res, 200, { message: `Successfully added into wishlists.` }));
        } else {
          const wishlist = new Wishlist({
            product: req.params.id,
            user: req.user._id
          })
          const addWishlist = await wishlist.save()
          if (!addWishlist) RequestFailure(res, 400, 'Bad request')
          else RequestSuccess(res, 200, { message: `Successfully added into wishlists.` })
        }
      })
    }
  } catch (e) { RequestFailure(res, 500, e.message) }
}


// wishlist based on user 
exports.getWishlist = async (req, res, next) => {
  try {
    await Wishlist.find({ user: req.user._id, isDeleted: false }, '_id product user').populate('product').exec(async (err, data) => {
      if (err) { RequestFailure(res, 500, err.message) }
      // filter wishlist data based on user (user token)
      const wishlistData = data.filter((result) => {
        if (result.user.toString() === req.user._id.toString()) return true
        return false
      })
      if (!wishlistData) RequestFailure(res, 400, 'Bad request')
      else RequestSuccess(res, 200, wishlistData)
    })
  } catch (e) { RequestFailure(res, 500, e.message) }
}

// all wishlist data for admin
exports.getAllWishlist = async (req, res, next) => {
  try {
    await Wishlist.find().populate('product').then(wishData => {
      if (!wishData) RequestFailure(res, 400, 'Bad request')
      else RequestSuccess(res, 200, wishData)
    })
  } catch (e) { RequestFailure(res, 500, e.message || 'Bad request') }
}

// remove from wishlists
exports.deleteWishlist = async (req, res, next) => {
  try {
    await Wishlist.findById(req.params.id).then(async (response) => {
      response.isDeleted = true
      await response.save().then((result) => {
        if (result) RequestSuccess(res, 200, { message: 'Successfully removed from wishlist !' })
        else RequestFailure(res, 500, 'Bad request')
      })
    })
  } catch (e) { RequestFailure(res, 500, e.message || 'Bad request') }
}