const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose')
const userSchema = new Schema({
    email:{
        type: String,
        required: true
    }
});
userSchema.plugin(passportLocalMongoose);
// phuging  username hashing salting add kr deta hai
module.exports = mongoose.model('User', userSchema);


