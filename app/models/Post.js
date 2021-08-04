const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Post = new Schema({
    userPost: {
        type: String,
        required: true
    }, // name's user post 
    content: {
        type: String,
        minLength: 1,
        required: true
    },
    image: {
        type: Array,
        default: []
    },
    like: {
        type: Array,
        default: []
    }, // User liked post 
    createDate: {
        type: Date,
        default: Date.now
    },
    updateDate: {
        type: Date,
        default: Date.now
    }
}, {
    collection: "Post"
});
module.exports = mongoose.model('Post', Post);