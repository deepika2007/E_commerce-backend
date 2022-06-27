const { RequestSuccess, RequestFailure } = require('../utils/Status')
const orderSchema = require('../Models/order');

exports.addOrders = (req, res, next) => {
  res.json({ status: 'success' })
}

exports.cancelOrders = (req, res, next) => {

}