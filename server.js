const app = require('./app');
const dotenv = require('dotenv')
dotenv.config({ path: 'config/config.env' })// config
require('./config/db') //server calling 

app.listen(process.env.PORT, () => {
    console.log(`connection setup at ${process.env.PORT}`)
})