const accountController = require("../app/controllers/AccountControllers")
const express = require("express");
const router = express.Router();
const checkToken = require("../app/auth/CheckToken");
const uploadFile = require("../app/modules/uploadimage");
// [POST] Register Account
router.post("/register", accountController.registerAccount);
// [POST] Login Account
router.post("/login", accountController.loginAccount);
// [GET] Show Account
router.get("/information", checkToken, accountController.informationAccount);
// [POST] Post an article
router.post("/post", checkToken, accountController.postArticle);
// [PUT] Put an article
router.put("/updatepost", checkToken, accountController.updateArticle);
// [DELETE] Soft delete an article
router.delete("/deletepost", checkToken, accountController.softDelete);
// [PUT] restore an article
router.put("/restorepost", checkToken, accountController.retoreArticle);
// [DELETE] Destroy an article
router.delete("/destroypost/:_id", checkToken, accountController.destroy);

module.exports = router;