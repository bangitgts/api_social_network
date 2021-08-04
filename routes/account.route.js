const accountController = require("../app/controllers/AccountControllers")
const express = require("express");
const router = express.Router();
const checkToken = require("../app/auth/CheckToken")

// [POST] Register Account
router.post("/register", accountController.registerAccount);
// [POST] Login Account
router.post("/login", accountController.loginAccount);
// [GET] Show Account
router.get("/information", checkToken, accountController.informationAccount);

module.exports = router;