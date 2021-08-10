const mongoose = require('mongoose');

async function connect() {
    try {
        await mongoose.connect('mongodb://localhost:27017/social_network', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
        });
        console.log("Connect MongDb successfully!!!")
    } catch (error) {
        console.log("Connect failure!!!")
    }
}
module.exports = {
    connect
};