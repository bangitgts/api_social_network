require('dotenv').config()
const express = require("express");
const app = express();
const socket = require("socket.io");
const port = process.env.PORT;;
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const db = require("./config/db");
const route = require("./routes/index.js");
const requestIp = require('request-ip');
app.use(express.static('assets'));
// Connect DB
db.connect();
// Use cors
app.use(cors());
app.use(cookieParser());
// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: false
}));
// [USE] parse application/json
app.use(bodyParser.json());
// [USE] Morgan
app.use(morgan("combined"));
// ip use
app.use(requestIp.mw());
// Router
route(app);

// app.listen(port, () => {
//     console.log(`Example app listening at http://localhost:${port}`);
// });


var server = app.listen(8081, function() {
    var host = server.address().address
    var port = server.address().port
    console.log("Example app listening at http://%s:%s", host, port)
});
const io = socket(server);
io.on("connection", function(socket) {
    console.log("Made socket connection");
    socket.on("disconnect", function() {
        console.log("Made socket disconnected");
    });
    socket.on("send-notification", function(data) {
        io.emit("new-notification", data);
    });
});