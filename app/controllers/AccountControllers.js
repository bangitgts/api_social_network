const md5 = require('md5');
const jwt = require("jsonwebtoken");
const AccountModel = require('../models/Account')
class AccountController {
    // [POST] Register Account
    registerAccount(req, res) {
        let fullName = req.body.fullName;
        let user = req.body.user;
        let email = req.body.email;
        let password = req.body.password;
        let sex = req.body.sex;

        AccountModel.findOne({
                email: email
            })
            .then(data => {
                if (data) {
                    return res.status(400).json({
                        message: "Account created failed. This email already exists",
                        status: 400,
                        success: false
                    });
                } else {
                    AccountModel.findOne({
                            user: user
                        })
                        .then(data => {
                            if (data) {
                                return res.status(400).json({
                                    message: "Account created failed. This user already exists",
                                    status: 400,
                                    success: false
                                });
                            } else {
                                if (password.length <= 6) {
                                    return res.status(406).json({
                                        message: "Password is too short. Need to put more than 6 characters",
                                        status: 406,
                                        success: false
                                    });
                                } else {
                                    AccountModel.create({
                                        fullName: fullName,
                                        user: user,
                                        email: email,
                                        password: md5(password),
                                        sex: sex
                                    })
                                    return res.status(200).json({
                                        message: "Account created successfully",
                                        status: 200,
                                        success: true
                                    });
                                }
                            }
                        })
                }
            })
            .catch(err => {
                res.status(500).json({
                    message: "Server Error",
                    status: 500,
                    success: false,
                })
            })
    };
    // [POST] Login Account
    loginAccount(req, res) {
        let userAccount = req.body.userAccount; // user or Email
        let password = md5(req.body.password);
        AccountModel.findOne({
                $or: [{
                        email: userAccount,
                        password: password
                    },
                    {
                        user: userAccount,
                        password: password
                    },
                ],
            })
            .then(data => {
                if (data) {
                    let token = jwt.sign({
                            _id: data._id,
                        },
                        "password"
                    );
                    res.header("auth-token", token);
                    res.status(200).json({
                        message: "Loggin successfully",
                        data: {
                            user: data.user,
                            email: data.email,
                            password: md5(password),
                            token: token,
                        },
                        success: true,
                        status: 200,
                    });
                } else {
                    return res.status(400).json({
                        message: "Loggin failed. Account or password does not match",
                        success: false,
                        status: 400,
                    });
                }
            })
    };
    // [GET] Information Account
    informationAccount(req, res) {
        AccountModel.findOne({
                _id: req.user,
            })
            .then((data) => {
                res.status(200).json({
                    status: 200,
                    success: true,
                    data: {
                        fullName: data.fullName,
                        user: data.user,
                        email: data.email,
                        sex: data.sex,
                        avatar: data.avatar,
                        description: data.description,
                        createDate: data.createDate,
                    },
                    message: "Login successfully",
                });
            })
            .catch((err) => {
                res.status(400).json({
                    status: 400,
                    success: false,
                    message: "Login failed",
                });
            });
    }

};
module.exports = new AccountController();