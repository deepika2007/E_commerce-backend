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
        response?.map((data) => {
          data.items = data.items.filter((item) => {
            if (!item.isDeleted && item.quantity > 0) return true;
            else return false;
          })
        })
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
        let filter, condition;
        if (isItemAdded) {
          // if same items added in cart and update quantity
          filter = { 'owner': req.user._id, "items.product": product }
          condition = {
            "$set": {
              "items.$": {
                ...req.body.items,
                quantity: isItemAdded.quantity + quantity
              }
            }
          }
        } else {
          //  if add other items into cart items  
          filter = { 'owner': req.user._id }
          condition = {
            "$push": {
              "items": req.body.items
            }
          }
        }
        await cartSchema.findOneAndUpdate(filter, condition).exec((err, data) => {
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
    await cartSchema.findOne(req.user._id).exec((err, response) => {
      if (err) RequestFailure(res, 500, 'Bad request')
      if (response) {
        response?.items.forEach(element => {
          if (element._id.toString() === req.params.id.toString()) {
            element.isDeleted = true;
            response.save().then((result) => {
              if (result) RequestSuccess(res, 200, { message: 'Successfully removed from cart !' })
              else RequestFailure(res, 500, 'Bad request')
            })
          }
        });
      }
    })
  } catch (e) { RequestFailure(res, 500, e.message || 'Bad request') }
}

// totalPrice: isItemAdded.totalPrice + (quantity*price)