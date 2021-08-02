const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Account = new Schema({
    user: {
        type: String,
        lowercase: true,
        minLength: 1,
        maxLength: 15,
        required: [true, "User required"]
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        validate: {
            validator: function(v) {
                return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
            },
            message: "Please enter a valid email"
        },
        required: [true, "Email required"]
    },
    password: {
        type: String,
        minLength: 6,
        required: [true, "Password required"]
    },
    avatar: {
        type: String,
        default: "abc"
    },
    description: {
        type: String
    },
    createDate: {
        type: Date,
        default: Date.now
    }

});
module.exports = mongoose.model('Account', Account);