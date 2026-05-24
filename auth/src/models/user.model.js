const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
    },
    profilePic:{
        type:String,
    },
    role:{
        type:String,
        enum:['user','artist','admin'],
        default:'user'
    },
    googleId:{
        type:String,
    },
    provider:{
        type:String,
        enum:['local','google'],
        default:'local'
    },
    isVerified:{
        type:Boolean,
        default:true
    },
    otp:{
        type:String,
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
    
});

const user = mongoose.model('user',userSchema);

module.exports = user;