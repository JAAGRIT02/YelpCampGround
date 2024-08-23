const { string, required } = require('joi')
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const passportLocalMongoose = require('passport-local-mongoose')

const UserSchema = new Schema({
    email:{
        type:String,
        required: true,
        unique:true
    }
});

UserSchema.plugin(passportLocalMongoose);   //automatically adds the username and password field in the schema


module.exports = mongoose.model('user',UserSchema);
