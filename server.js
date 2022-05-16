const app = require('./app');
const dotenv = require('dotenv')
dotenv.config({ path: 'config/config.env' })// config
require('./config/db') //server calling 

const server = app.listen(process.env.PORT, () => {
    console.log(`connection setup at ${process.env.PORT}`)
})
process.on('unhandledRejection', (err) => {
    console.log(`Error: ${err.message}`)
    console.log('shutting down')
    server.close(()=>{
        process.exit(1)
    })
})