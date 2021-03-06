const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const formatDate = require("../controllers/FormatDate")
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
    notification: {
        type: Array,
        default: []
    },
    friend: {
        type: Array,
        default: []
    },
    friendWait: {
        type: Array,
        default: []
    },
    follower: {
        type: Array,
        default: []
    }, // Nguoi da theo doi
    followed: {
        type: Array,
        default: []
    }, // Da theo doi nguoi nao
    sex: {
        type: String,
        require: true
    },
    avatar: {
        type: String,
        default: "abc"
    },
    description: {
        type: String,
        default: ""
    },
    showLog: {
        type: Array,
        default: ''
    },
    createDate: {
        type: Object,
        default: formatDate(Date.now())
    }
}, {
    collection: "Account"
});
module.exports = mongoose.model('Account', Account);