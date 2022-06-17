const mongoose = require('mongoose');
const validator = require('validator')

const WishListSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
})

module.exports = new mongoose.model('Wishlist', WishListSchema)