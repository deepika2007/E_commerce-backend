const express = require('express');
const router = express.Router()
const { createProduct, showAllProduct, updateProduct, deleteProduct, showOneProduct } = require('../controllers/products');
const { isAuthenticatedUser, authorizeRole } = require('../utils/authCheck');

router.route('/product')
    .post(isAuthenticatedUser, authorizeRole('admin'), createProduct)
    .get(showAllProduct);

router.route('/product/:id').get(showOneProduct)
    .put(isAuthenticatedUser, authorizeRole('admin'), updateProduct)
    .delete(isAuthenticatedUser, authorizeRole('admin'), deleteProduct);

module.exports = router