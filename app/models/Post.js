const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Post = new Schema({


}, {
    collection: "Post",
});
module.exports = mongoose.model('Post', Post);