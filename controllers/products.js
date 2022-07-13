const ProductModel = require('../models/products');
const ErrHandler = require('../utils/errorHandler');
const dotenv = require('dotenv'); //env variables
dotenv.config();
const { default: slugify } = require('slugify');
const { RequestSuccess, RequestFailure } = require('../utils/Status')
const ApiFeature = require('../utils/apiFeatures');

const productPayload = (req) => {
    const { name, description, price, category, stock } = req.body;
    const thumbnail = req?.files?.map((file) => {
        return { url: `http://localhost:8000/${file?.path}` }
    })
    return { name, description, price, category, stock, thumbnail }
}

// file uploader 
exports.createProduct = async (req, res, next) => {
    try {
        const { name, description, price, category, stock } = req.body;
        const thumbnail = req.files?.map((file) => {
            return { url: `http://localhost:8000/${file?.path}` }
        })
        const product = { name, slug: slugify(name), description, price, category, stock, thumbnail }
        const createPayload = new ProductSchema(product)
        const createProducts = await createPayload.save()
        if (!createProducts) RequestFailure(res, 404, 'Product not found')
        else RequestSuccess(res, 201, { message: 'Product added successfully !' })
    } catch (e) { RequestFailure(res, 500, e.message) }
};

// all Product data
exports.showAllProduct = async (req, res, next) => {
    try {
        const apiFeature = new ApiFeature(ProductModel.find(), req.query).search().filter().pagination();      //in pagination function pass limit value 
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
        const { name, description, price, category, stock } = req.body;
        const thumbnail = req.files?.map((file) => {
            return { url: `http://localhost:8000/${file?.path}` }
        })
        const product = { name, description, price, category, stock, thumbnail }
        const payload = req.files?.length ? product : req.body;
        const data = await ProductSchema.findByIdAndUpdate(_id, payload, {
            new: true
        });
        if (!data) return RequestFailure(res, 404, 'Product not found')
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