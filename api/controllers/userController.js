const mongoose = require('mongoose');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.user_signup = (req, res, next) => {
    User.find({email: req.body.email})
            .exec()
            .then(user => {
                if (user.lenght >= 1) {
                    return res.status(409).json({
                        message: 'Email exist'
                    });
                } else {
                    bcrypt.hash(req.body.password, 10, (err, hash) => {
                        if (err) {
                            return res.status(500).json({error: err});
                        } else {
                            const user = new User({
                                _id: mongoose.Types.ObjectId(),
                                email: req.body.email,
                                password: hash,
                                mobile: req.body.mobile
                            });
                            user.save()
                                    .then(result => {
                                        console.log(result);
                                        res.status(201).json({
                                            message: 'Account has been created'
                                        });
                                    })
                                    .catch(err => {
                                        res.status(500).json(err);
                                    });
                        }
                    });
                }
            })
            .catch();

}

exports.user_login = (req, res, next) => {
    User.find({email: req.body.email})
            .exec()
            .then(user => {
                if (user.length < 1) {
                    return res.status(404).json({
                        message: 'Auth Failed'
                    });
                }
                bcrypt.compare(req.body.password, user[0].password, (error, result) => {
                    if (error) {
                        return res.status(401).json({
                            message: 'Auth Failed'
                        });
                    }
                    if (result) {
                        const token = jwt.sign(
                                {
                                    email: user[0].email,
                                    id: user[0]._id
                                },
                                process.env.JWT_KEY,
                                {
                                    expiresIn: "1h"
                                }
                        );
                        return res.status(200).json({
                            message: 'Auth Success',
                            token: token
                        });
                    } else {
                        return res.status(401).json({
                            message: 'Auth Failed'
                        });
                    }
                });
            })
            .catch(err => {
                return res.status(500).json({error: err});
            });
}

exports.user_delete = (req, res, next) => {
    const id = req.body.userId;
    User.remove({_id: id})
            .exec()
            .then(result => {
                res.status(200).json({
                    message: "User Deleted",
                    result: result
                });
            })
            .catch(err => {
                error:err
            });
}