const Wishlist = require('../models/wishlist');
const { RequestSuccess, RequestFailure } = require('../utils/Status');

exports.addToWishlist = async (req, res, next) => {
  try {
    if (!req.params.id) RequestFailure(res, 400, 'Bad request')
    else {
      const includeWish = await Wishlist.find({ product: req.params.id, isDeleted: false, user: req.user._id })
      if (includeWish.length) RequestFailure(res, 500, 'Product already exist in wishlist ! ')
      else {
        const wishlist = new Wishlist({
          product: req.params.id,
          user: req.user._id
        })
        const addWishlist = await wishlist.save()
        if (!addWishlist) RequestFailure(res, 400, 'Bad request')
        else RequestSuccess(res, 200, { message: `Successfully added into wishlists.` })
      }
    }
  } catch (e) { RequestFailure(res, 500, e.message) }
}


// wishlist based on user 
exports.getWishlist = async (req, res, next) => {
  try {
    await Wishlist.find({ user: req.user._id, isDeleted: false }).populate('product').then(async (data) => {
      // filter wishlist data based on user (user token)
      const wishlistData = data.filter((result) => {
        if (result.user.toString() === req.user._id.toString()) return true
        return false
      })
      // create custom response for user 
      const responseData = []
      for (let wish of wishlistData) {
        const customResponse = {
          _id: wish._id,
          product: wish.product,
          user: wish.user
        }
        responseData.push(customResponse)
      }
      if (!responseData) RequestFailure(res, 400, 'Bad request')
      else RequestSuccess(res, 200, responseData)
    }).catch((e) => RequestFailure(res, 500, e.message))
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