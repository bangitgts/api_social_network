const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var mongoose_delete = require('mongoose-delete');
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
        type: String,
        default: ""
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
Post.plugin(mongoose_delete, {
    deletedAt: true
});
module.exports = mongoose.model('Post', Post);