const catchAsyncError = require('../middleware/catchAsyncError');
const ProductModel = require('../Models/products');
const ErrHandler = require('../utils/errorHandler');

// file uploader 
const createProduct = async (req, res, next) => {
    console.log(req.body)
    // const one = new Product(req.body)
    const createProducts = await ProductModel.create(req.body)
    res.status(201).json({status: true, result: createProducts})
    if (!createProducts) {
        return next(new ErrHandler('Product not found', 404))
    }
};

// all Product data

const showAllProduct = async (req, res) => {
    try {
        const data = await ProductModel.find();
        res.status(200).send(data)
    } catch (e) { res.status(400).send(e) }
}

// Product data by id 

const showOneProduct = async (req, res) => {
    try {
        const _id = req.params.id
        const data = await ProductModel.findById(_id);
        if (!data) return next(new ErrHandler('Product not found', 404))
        else { res.status(200).json({ status: true, result: data }) }
    } catch (e) { res.status(500).json({ status: false, result: e }) }
}

// update Product
const updateProduct = async (req, res) => {
    try {
        const one = {
            thumbnail: req.file.path,
            title: req.body.title,
            description: req.body.description,
            author: req.body.author,
        }
        console.log(req.body, one)
        const _id = req.params.id
        const data = await ProductModel.findByIdAndUpdate(_id, one, {
            new: true
        });
        if (!_id) return next(new ErrHandler('Product not found', 404))
        else { res.status(200).json({ status: true, result: data }) }
    } catch (e) { res.status(500).json({ status: false, result: e.message }) }
}

// delete Product 
const deleteProduct = async (req, res) => {
    try {
        const _id = req.params.id
        const data = await ProductModel.findByIdAndDelete(_id);
        if (!_id) return next(new ErrHandler('Product not found', 404))
        else { res.status(200).json({ status: true, result: data }) }
    } catch (e) { res.status(500).json({ status: false, result: e.message }) }
}
module.exports = { createProduct, showAllProduct, showOneProduct, updateProduct, deleteProduct }