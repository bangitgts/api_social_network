const accountController = require("../app/controllers/AccountControllers")
const express = require("express");
const router = express.Router();
const checkToken = require("../app/auth/CheckToken");
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
router.put("/restorepost", checkToken, accountController.restoreArticle);
// [DELETE] Destroy an article
router.delete("/destroypost/:_id", checkToken, accountController.destroy);
// [PUT] Like an article
router.put("/likepost/:_id", checkToken, accountController.likeArticle); // _id bai viet
// [PUT] Unlike an article
router.put("/unlikepost/:_id", checkToken, accountController.unlikeArticle); // _id bai viet

module.exports = router;