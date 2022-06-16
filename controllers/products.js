const ProductModel = require('../models/products');
const ErrHandler = require('../utils/errorHandler');
const dotenv = require('dotenv'); //env variables
dotenv.config();
const { RequestSuccess, RequestFailure } = require('../utils/Status')
const ApiFeature = require('../utils/apiFeatures');

// file uploader 
exports.createProduct = async (req, res, next) => {
    try {
        const newProduct = new ProductModel(req.body)
        const createProducts = await newProduct.save()
        if (!createProducts) RequestFailure(res, 400, 'Something went wrong.')
        RequestSuccess(res, 201, createProducts)
    } catch (e) { RequestFailure(res, 500, e.message) }
};

// all Product data
exports.showAllProduct = async (req, res, next) => {
    try {
        const apiFeature = new ApiFeature(ProductModel.find(), req.query).search().pagination();     //in pagination function pass limit value 
        const data = await apiFeature.query;
        if (!data) RequestFailure(res, 404, 'Products not found')
        else RequestSuccess(res, 200, data)
    } catch (e) { RequestFailure(res, 500, e.message) }
}


// Product data by id 
exports.showOneProduct = async (req, res, next) => {
    try {
        const _id = req.params.id
        const data = await ProductModel.findById(_id);
        if (!data) RequestFailure(res, 404, 'Product not found')
        else RequestSuccess(res, 200, data)
    } catch (e) { RequestFailure(res, 500, e.message) }
}

// update Product
exports.updateProduct = async (req, res, next) => {
    try {
        const _id = req.params.id
        const data = await ProductModel.findByIdAndUpdate(_id, req.body, {
            new: true
        });
        if (!_id) RequestFailure(res, 404, 'Product not found')
        else RequestSuccess(res, 200, data)
    } catch (e) { RequestFailure(res, 500, e.message) }
}

// delete Product 
exports.deleteProduct = async (req, res, next) => {
    try {
        const _id = req.params.id
        const data = await ProductModel.findByIdAndDelete(_id);
        if (!_id) RequestFailure(res, 404, 'Product not found')
        else RequestSuccess(res, 200, data)
    } catch (e) { RequestFailure(res, 500, e.message) }
}