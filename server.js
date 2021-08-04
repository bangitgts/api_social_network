require('dotenv').config()
const express = require("express");
const app = express();
const port = process.env.PORT;
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const db = require("./config/db");
const route = require("./routes/index.js");
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
// Router
route(app);
app.get("/", (req, res) => {
    res.json({
        message: "API"
    });
});
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});