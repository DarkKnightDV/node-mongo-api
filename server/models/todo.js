const mongoose = require('mongoose');

const ToDo = mongoose.model('Todo' , {
    text: {
        type : String,
        required: true,
        minlength: 5,
        trim: true
    },
    completed : {
        type: Boolean,
        default: false
    },
    completedAt : {
        type: Date,
        default: new Date()
    },
    _creator : {
        type : mongoose.Schema.Types.ObjectId,
        required: true
    }
});

module.exports = {ToDo};