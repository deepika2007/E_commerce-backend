const express = require('express');
const router = express.Router()
const { createProduct, showAllProduct, updateProduct, deleteProduct, showOneProduct } = require('../controllers/products');

router.route('/products').post(createProduct)
router.route('/products').get(showAllProduct);
router.route('/product').get(showAllProduct);
router.route('/product/:id').get(showOneProduct).put(updateProduct).delete(deleteProduct)
module.exports = router