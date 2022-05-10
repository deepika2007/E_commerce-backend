const mongoose = require('mongoose');
const validator = require('validator')

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add product name '],
    },
    description: {
        type: String,
        required: [true, 'Please add product description ']
    },
    price: {
        type: Number,
        required: [true, 'Please add product price ']
    },
    thumbnail: [
        {
            public_id: {
                type: String,
                required: true
            },
            url: {
                type: String,
                required: true
            }
        }
    ],
    category: {
        type: String,
        required: [true,'Please add product category']
    },
    stock:{
        type: Number,
        required: [true,'Please add product stock']
    },
    createdAt:{
        type:Date,
        default:Date.now
    }

})

const ProductsModel = new mongoose.model('Products', ProductSchema);
module.exports = ProductsModel;