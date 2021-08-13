const md5 = require('md5');
const jwt = require("jsonwebtoken");
const AccountModel = require('../models/Account');
const PostModel = require('../models/Post');
const uploadFile = require('../modules/uploadimage');
const formatDate = require("../controllers/FormatDate");
const requestIp = require('request-ip');
class AccountController {
    // [POST] Register Account
    registerAccount(req, res) {
        let fullName = req.body.fullName;
        let user = req.body.user;
        let email = req.body.email;
        let password = req.body.password;
        let sex = req.body.sex;
        if (sex === "Male" || sex === "Female") {
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
        } else {
            res.status(404).json({
                status: 404,
                success: false,
                message: "Input data is incorrect",
            })
        }
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
                            exp: Math.floor(Date.now() / 1000) + (60 * 60),
                            _id: data._id,

                        },
                        "password"
                    );
                    res.header("auth-token", token);
                    const showLog = {
                        action: "Login",
                        ip: requestIp.getClientIp(req),
                        date: formatDate(Date.now())
                    };
                    data.showLog.push(showLog);
                    data.save();
                    return res.status(200).json({
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
                return res.status(200).json({
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
                return res.status(400).json({
                    status: 400,
                    success: false,
                    message: "Login failed",
                });
            });
    };
    // [PUT] Add Friend
    async makeFriend(req, res) {
        try {
            const idUser = req.params._id; // _id User them 
            const userLogin = await AccountModel.findOne({
                _id: req.user._id
            }); // User logined
            const userAdd = await AccountModel.findOne({
                _id: idUser
            });
            if (userAdd === undefined) {
                return res.status(404).json({
                    status: 404,
                    success: false,
                    message: "Couldn't find an account to add",
                });
            } else {
                const boolFlag = userLogin.friend.find(el => el._id === idUser);
                if (boolFlag === undefined) {
                    const tempAdd = {
                        _id: idUser,
                        user: userAdd.user,
                        addDate: formatDate(Date.now()),
                        flag: false //False === Dang cho ket ban, true === ket ban thanh cong
                    };
                    const tempWait = {
                        _id: req.user._id,
                        user: userLogin.user,
                        addDate: formatDate(Date.now()),
                    };
                    const addLog = {
                        action: "Add Friend",
                        ip: requestIp.getClientIp(req),
                        date: formatDate(Date.now())
                    }
                    const userFollow = userLogin.followed.find(el => el._id === idUser);
                    if (userFollow === undefined) {
                        const tempFollowed = {
                            _id: idUser,
                            user: userAdd.user,
                            followDate: formatDate(Date.now())
                        };
                        const tempFollower = {
                            _id: req.user._id,
                            user: userLogin.user,
                            followDate: formatDate(Date.now())
                        };
                        userLogin.followed.push(tempFollowed);
                        userAdd.follower.push(tempFollower);
                    }
                    userLogin.showLog.push(addLog);
                    userLogin.friend.push(tempAdd);
                    userAdd.friendWait.push(tempWait);
                    userLogin.save();
                    userAdd.save();
                    return res.status(200).json({
                        status: 200,
                        success: true,
                        message: "Sent friend request",
                    });

                } else {
                    return res.status(403).json({
                        status: 403,
                        success: false,
                        message: "Two people have made friends or waiting for confirmation",
                    });
                }
            }

        } catch (err) {
            return res.status(500).json({
                status: 500,
                success: false,
                message: "Server Error",
            });
        }
    };
    async confirmFriend(req, res) {
        try {
            const userLogin = await AccountModel.findOne({
                _id: req.user._id
            });
            const userWait = await AccountModel.findOne({
                _id: req.params._id
            });
            const confirmLog = {
                action: `Confirm Friend ${userWait.user}`,
                ip: requestIp.getClientIp(req),
                date: formatDate(Date.now())
            }
            const confirmedLog = {
                action: `Confirmed to ${userLogin.user}`,
                ip: requestIp.getClientIp(req),
                date: formatDate(Date.now())
            }
            const friendWait = userLogin.friendWait.find(el => el._id === req.params._id);
            if (!friendWait) {
                const newWait = userLogin.friendWait.filter(el => el._id !== req.params._id);
                userLogin.friendWait = newWait;
                const friendLogin = {
                    _id: userWait._id,
                    user: userWait.user,
                    confirmDate: formatDate(Date.now()),
                };
                const friendWait = {
                    _id: userLogin._id,
                    user: userLogin.user,
                    confirmDate: formatDate(Date.now()),
                };
                userLogin.showLog.push(confirmLog);
                userLogin.friend.push(confirmedLog);
                userWait.showLog.push(confirmLog);
                userWait.friend.push(friendWait);
                userLogin.save();
                userWait.save();
                return res.status(200).json({
                    status: 200,
                    success: true,
                    message: "Add friend successfully",
                });
            } else {
                return res.status(403).json({
                    status: 403,
                    success: false,
                    message: "Two people have made friends",
                });
            }
        } catch (err) {
            next(err);
        }
    };
    async followFriend(req, res) {
        try {
            const userLogin = await AccountModel.findOne({
                _id: req.user._id
            }); // Userlogin
            const userFollow = await AccountModel.findOne({
                _id: req.params._id
            });
            const followFlag = userLogin.find(el => el._id === userFollow);
            if (followFlag === undefined) {
                const tempFollowed = {
                    _id: idUser,
                    user: userAdd.user,
                    followDate: formatDate(Date.now())
                };
                const tempFollower = {
                    _id: req.user._id,
                    user: userFollow.user,
                    followDate: formatDate(Date.now())
                };
                userLogin.followed.push(tempFollowed);
                userFollow.follower.push(tempFollower);
                userLogin.save();
                userFollow.save();
                return res.status(200).json({
                    status: 200,
                    success: true,
                    message: "Followed successfully",
                });
            } else {
                return res.status(403).json({
                    status: 403,
                    success: false,
                    message: "Followed before",
                });
            }
        } catch (err) {
            return res.status(500).json({
                status: 500,
                success: false,
                message: "Server Error",
            });
        }

    };
    // [POST] POST Article
    postArticle(req, res) {
        uploadFile(req, res, (error) => {
            if (error) {
                return res.status(402).json({
                    status: 402,
                    success: false,
                    message: "File type must be png or jpeg",
                });
            }
            const content = req.body.content;
            let image = '';
            if (req.file !== undefined)
                image = req.file.filename;
            PostModel.create({
                    userPost: req.user._id,
                    content: content,
                    image: image
                })
                .then(data => {
                    return res.status(200).json({
                        status: 200,
                        success: true,
                        message: "Posted successfully",
                    });
                })
                .catch(err => {
                    return res.status(500).json({
                        status: 500,
                        success: false,
                        message: "Server error",
                    });
                })
        })
    };
    // [PUT] PUT Article
    updateArticle(req, res) {
        uploadFile(req, res, (error) => {
            if (error) {
                return res.status(402).json({
                    status: 402,
                    success: false,
                    message: "File type must be png or jpeg",
                });
            }
            let image;;
            if (req.file !== undefined)
                image = req.file.filename
            const content = req.body.content; // content change
            const idPost = req.body._id; // id post
            PostModel.findOne({
                    _id: idPost,
                    userPost: req.user
                })
                .then(data => {
                    if (content !== undefined)
                        data.content = content;
                    if (image !== undefined)
                        data.image = image;
                    if (content !== undefined || image !== undefined)
                        data.updateDate = formatDate(Date.now());
                    data.save();
                    return res.status(200).json({
                        status: 200,
                        success: true,
                        message: "Update successfuly",
                    });
                })
                .catch(err => {
                    return res.status(404).json({
                        status: 404,
                        success: false,
                        message: "Data Not Found",
                    });
                })
        })

    };
    // [DELETE] Delete Article
    softDelete(req, res) {
        let _id = req.params._id; // _id post delete
        const _user = req.user._id; // user id

        PostModel.delete({
            _id: _id,
            userPost: _user
        }, function(err, result) {
            if (err) {
                return res.status(404).json({
                    status: 404,
                    success: false,
                    message: "Data Not Found",
                })
            } else
                return res.status(200).json({
                    status: 200,
                    success: true,
                    message: "Delete Successfuly",
                })

        });
    };
    // [PUT] Restore Article
    restoreArticle(req, res) {
        let _id = req.params._id;
        const _user = req.user._id; // user id
        PostModel.restore({
            _id: _id,
            userPost: _user
        }, function(err, result) {
            if (err) {
                return res.status(404).json({
                    status: 404,
                    success: false,
                    message: "Data Not Found",
                })
            } else
                return res.status(200).json({
                    status: 200,
                    success: true,
                    message: "Restore Successfuly",
                })
        });
    };
    // [DELETE] Destroy Article
    destroy(req, res) {
        PostModel.deleteOne({
                _id: req.params._id,
                userPost: req.user._id,
                deleted: true
            }).then(data => {
                return res.status(200).json({
                    status: 200,
                    success: true,
                    message: "Delte Successfuly",
                })
            })
            .catch(err => {
                return res.status(404).json({
                    status: 404,
                    success: false,
                    message: "Data Not Found",
                })
            })
    };
    // [PUT] Like Article
    likeArticle(req, res) {
        PostModel.findOne({
                _id: req.params._id
            })
            .then(data => {
                const flag = data.like.find(element => element === req.user._id);
                if (flag === undefined) {
                    data.like.push(req.user._id);
                    data.save();

                    return res.status(200).json({
                        status: 200,
                        success: true,
                        message: "Like Successfuly",
                    })
                } else {
                    return res.status(405).json({
                        status: 405,
                        success: false,
                        message: "This account liked the post",
                    })
                }

            })
            .catch(err => {
                return res.status(500).json({
                    status: 500,
                    success: false,
                    message: "Server Error",
                })
            })
    }
    unlikeArticle(req, res) {
        function arrayRemove(arr, value) {
            return arr.filter(function(ele) {
                return ele != value;
            });
        };
        PostModel.findOne({
                _id: req.params._id
            })
            .then(data => {
                const flag = data.like.find(element => element == req.user._id);
                if (flag === undefined) {
                    return res.status(405).json({
                        status: 405,
                        success: false,
                        message: "This account didn't like the post",
                    })
                } else {
                    data.like = arrayRemove(data.like, req.user._id);
                    data.save();
                    return res.status(200).json({
                        status: 200,
                        success: true,
                        message: "Unlike Successfuly",
                    })
                }
            })
            .catch(err => {
                res.status(500).json({
                    status: 500,
                    success: false,
                    message: "Server Error",
                })
            })
    }
};
module.exports = new AccountController();