const mongoose = require('mongoose');
const orderSchema = new mongoose.Schema({
  shippingInfo: {
    address: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    country: {
      type: String,
      required: true
    },
    pincode: {
      type: String,
      required: true
    },
    phoneNumber: {
      type: String,
      required: true
    }
  },
  orderItems: [
    {
      name: {
        type: String,
        required: true
      },
      price: {
        type: Number,
        required: true
      },
      quantity: {
        type: String,
        required: true
      },
      image: {
        type: String,
        required: true
      },
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      }
    }
  ],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  paymentInfo: {
    id: {
      type: String,
      required: true
    },
    status: {
      type: String,
      required: true
    },
  },
  paidAt: {
    type: Date,
    required: true
  },
  itemsPrice: {
    type: Number,
    required: true,
    default: 0
  },
  taxPrice: {
    type: Number,
    required: true,
    default: 0
  },
  shippingPrice: {
    type: Number,
    required: true,
    default: 0
  },
  totalPrice: {
    type: Number,
    required: true,
    default: 0
  },
  orderStatus: {
    type: String,
    required: true,
    default: 'Processing'
  },
  deliveredAt: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true })
module.exports = new mongoose.model('Order', orderSchema)