const express = require('express');
var bodyParser = require('body-parser');
const cors = require("cors");

const app = express();
const errorMiddleWare = require('./middleware/error');
const productDetails = require('./routes/products')

const corsOptions = {
    origin: '*',
    credentials: true,            //access-control-allow-credentials:true
    optionSuccessStatus: 200,
}

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.json());
app.use('/uploads', express.static('uploads'));// here public is name of a folder of static file
app.use(cors(corsOptions)) // Use this after the variable declaration
app.set("view engine", "ejs");// Set EJS as templating engine
app.use(errorMiddleWare)// middleware for error 
app.use('/api',productDetails)

module.exports = app