const mongoose = require("mongoose");
const Schema = mongoose.Schema;
//we required following in npmjs.com passportLocalMongoosw
const passportLocalMongoose = require("passport-local-mongoose");


//we create schema
const userSchema = new Schema({
 email:{
    type: String,
    required: true
 }
});

userSchema.plugin(passportLocalMongoose);

//we export our module on npmjs.com
module.exports = mongoose.model('User', userSchema);