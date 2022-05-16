const mongoose = require('mongoose');
const dotenv = require('dotenv')
dotenv.config({ path: 'config/config.env' })// config

mongoose.connect(process.env.DB_URL, {
    // useCreateIndex: true,
    // useNewUrlParser: true,
    // useUnifiedTopology: true
}).then(() => {
    console.log('stablish')
})