const mongoose = require('mongoose');
const Schema = mongoose.Schema;

function formatDate() {
    let today = new Date(Date.now());
    return {
        date: `${today.getDate()}/${today.getMonth()+1}/${today.getFullYear()}`,
        hours: `${today.getHours()}:${today.getMinutes()}`
    }
};
const timeNow = formatDate();
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
    friend: {
        type: Array,
        default: []
    },
    follower: {
        type: Array,
        default: []
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
        type: Object,
        default: timeNow
    }
}, {
    collection: "Account"
});
module.exports = mongoose.model('Account', Account);