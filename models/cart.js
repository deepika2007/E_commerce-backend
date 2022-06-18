const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectID, ref: 'Product' },
      quantity: { type: Number, default: 1 },
      price: { type: Number, default: 0 },

    }
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }

}, { timestamps: true })

module.exports = new mongoose.model('Cart', cartSchema)