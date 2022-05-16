const ProductModel = require('../Models/products');
const ErrHandler = require('../utils/errorHandler');
const dotenv = require('dotenv'); //env variables
dotenv.config();
const { RequestSuccess, RequestFailure } = require('../utils/Status')
const ApiFeature = require('../utils/apiFeatures');

// file uploader 
const createProduct = async (req, res, next) => {
    try {
        const createProducts = await ProductModel.save(req.body)
        if (!createProducts) next(new ErrHandler('Product not found', 404))
        RequestSuccess(res, 201, createProducts)
    } catch (e) { next(e.message) }
};

// all Product data

const showAllProduct = async (req, res) => {
    try {
        const apiFeature = new ApiFeature(ProductModel.find(), req.query).search().pagination();     //in pagination function pass limit value 
        const data = await apiFeature.query;
        if (!data) RequestFailure(res, 404, 'Products not found')
        else RequestSuccess(res, 200, data)
    } catch (e) { RequestFailure(res, 500, e.message) }
}


// Product data by id 

const showOneProduct = async (req, res) => {
    try {
        const _id = req.params.id
        const data = await ProductModel.findById(_id);
        if (!data) next(new ErrHandler('Product not found', 404))
        else RequestSuccess(res, 200, data)
    } catch (e) { RequestFailure(res, 500, e.message) }
}

// update Product
const updateProduct = async (req, res) => {
    try {
        const _id = req.params.id
        const data = await ProductModel.findByIdAndUpdate(_id, req.body, {
            new: true
        });
        if (!_id) return next(new ErrHandler('Product not found', 404))
        else RequestSuccess(res, 200, data)
    } catch (e) { RequestFailure(res, 500, e.message) }
}

// delete Product 
const deleteProduct = async (req, res) => {
    try {
        const _id = req.params.id
        const data = await ProductModel.findByIdAndDelete(_id);
        if (!_id) return next(new ErrHandler('Product not found', 404))
        else RequestSuccess(res, 200, data)
    } catch (e) { RequestFailure(res, 500, e.message) }
}

module.exports = { createProduct, showAllProduct, showOneProduct, updateProduct, deleteProduct }