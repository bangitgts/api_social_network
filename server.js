require('dotenv').config()
const express = require("express");
const app = express();
const path = require("path");
const port = process.env.port;
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
//use cors
app.use(cors());
app.use(cookieParser());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// [USE] parse application/json
app.use(bodyParser.json());
// [USE] Morgan
app.use(morgan("combined"));

app.get("/", (req, res) => {
    res.json(process.env.port);
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});