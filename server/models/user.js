const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const userSchema = new Schema({
    email : {
        type: String,
        minlength: 5,
        trim: true,
        required: true
    },
    name : {
        required: true,
        type: String,
        trim: true,
        minlength: 5
    }
});

const User = mongoose.model('User', userSchema);

module.exports = {User};
