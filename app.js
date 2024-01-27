const express = require('express');
const app = express();
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
const cors = require("cors");

const errorMiddleWare = require('./middleware/error');
const userDetails = require('./routes/authLogin');
const productDetails = require('./routes/products');
const wishlistRouter = require('./routes/wishlist')
const cartRouter = require('./routes/cart')
const dotenv = require('dotenv'); //env variables
dotenv.config();

const corsOptions = {
    origin: '*',
    credentials: true,            //access-control-allow-credentials:true
    optionSuccessStatus: 200,
}

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.json());
app.use(cookieParser())
app.use('/uploads', express.static('uploads'));// here public is name of a folder of static file
app.use(cors(corsOptions)) // Use this after the variable declaration
app.set("view engine", "ejs");// Set EJS as templating engine

app.use(errorMiddleWare)// middleware for error 
app.use('/api', productDetails) // product
app.use('/auth',userDetails) // auth
app.use('/wishlist', wishlistRouter) //wishlist
app.use('/cart', cartRouter) //cart

module.exports = app
