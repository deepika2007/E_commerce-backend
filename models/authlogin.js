const mongoose = require('mongoose');
const validator = require('validator')

const authUser = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: [true,'Email address is required'],
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Email is invalid')
            }
        }
    },
    password: {
        type: String,
        required: true
    },
    role:{
        type:String,
        default:'user',
        enum:['user','manager','admin']
    }

})

const Users = new mongoose.model('User', authUser);
module.exports = Users;