const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoose_delete = require('mongoose-delete');
const formatDate = require("../controllers/FormatDate")

const Post = new Schema({
    userPost: {
        type: Object,
        required: true
    }, // name's user post && _id 
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
        type: Object,
        default: formatDate(Date.now)
    },
    updateDate: {
        type: Object,
        default: null
    }
}, {
    collection: "Post"
});
Post.plugin(mongoose_delete, {
    deletedAt: true
});
module.exports = mongoose.model('Post', Post);