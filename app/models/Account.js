const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Account = new Schema({
    fullName: {
        type: String,
        minLength: 10,
        required: [true, "fullName required"]

    },
    user: {
        type: String,
        lowercase: true,
        minLength: 1,
        maxLength: 15,
        unique: true,
        required: [true, "User required"]
    },
    email: {
        type: String,
        unique: true,
        required: [true, "Email required"]
    },
    password: {
        type: String,
        minLength: 6,
        required: [true, "Password required"]
    },
    sex: {
        type: String
    },
    avatar: {
        type: String,
        default: "abc"
    },
    description: {
        type: String,
        default: ""
    },
    createDate: {
        type: Date,
        default: Date.now
    }

}, {
    collection: "Account",
});
module.exports = mongoose.model('Account', Account);