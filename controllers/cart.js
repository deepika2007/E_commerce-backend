const cartSchema = require('../models/cart');
const { RequestFailure, RequestSuccess } = require('../utils/Status');

// get cart details 
exports.getCart = async (req, res, next) => {
  try {
    await cartSchema.find({ owner: req.user._id }).populate({
        path: 'items',
        populate: {
          path: 'product'
        }
      })
      .then((response) => {
        if (response) RequestSuccess(res, 200, response);
        else RequestFailure(res, 500, e.message)
      })
  } catch (e) { RequestFailure(res, 500, e.message) }
}

// add to cart 

exports.addCart = async (req, res, next) => {
  try {
    const { product, quantity, price } = req.body.items;
    await cartSchema.findOne({ 'owner': req.user._id }).exec(async (err, cart) => {
      if (err) RequestFailure(res, 500, err.message || 'Bad request')
      if (cart) {
        // if some items in cart 
        const isItemAdded = cart.items.find((v) => v.product == product)
        let condition, logic;
        if (isItemAdded) {
          // if same items added in cart and update quantity
          condition = { 'owner': req.user._id, "items.product": product }
          logic = {
            "$set": {
              "items.$": {
                ...req.body.items,
                quantity: isItemAdded.quantity + quantity
              }
            }
          }
        } else {
          //  if add other items into cart items  
          condition = { 'owner': req.user._id }
          logic = {
            "$push": {
              "items": req.body.items
            }
          }
        }
        await cartSchema.findOneAndUpdate(condition, logic).exec((err, data) => {
          if (err) RequestFailure(res, 500, err.message || 'Bad request')
          else RequestSuccess(res, 200, { message: 'Product updated into cart.' })
        })
      } else {
        // if no items in cart 
        const newCartItem = new cartSchema({
          owner: req.user._id,
          items: [req.body.items],
        })
        newCartItem.save((err, data) => {
          if (err) RequestFailure(res, 500, err.message || 'Bad request')
          if (data) { RequestSuccess(res, 200, { message: 'Product added into cart.' }) }
        })
      }
    })
  } catch (e) { RequestFailure(res, 500, e.message) }
}

// remove from cart 

exports.deleteCart = async (req, res, next) => {
  console.log('req.params.id', req.params.id, cartSchema)
  try {
    const response = await cartSchema.findByIdAndDelete(req.params.id)
    if (response) RequestSuccess(res, 200, { message: 'Successfully removed from cart !' })
    else RequestFailure(res, 500, 'Bad request')
  } catch (e) { RequestFailure(res, 500, e.message || 'Bad request') }
}

// totalPrice: isItemAdded.totalPrice + (quantity*price)