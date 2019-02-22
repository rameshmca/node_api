const mongoose = require('mongoose');
const Order = require('../models/order');
const Product = require('../models/product');

exports.create_order = (req, res, next) => {

    Product.findById({_id: req.body.productId})
            .then(product => {
                if (!product) {
                    return res.status(404).json({
                        message: 'Product not found'
                    });
                }
                const order = new Order({
                    _id: mongoose.Types.ObjectId(),
                    productId: req.body.productId,
                    quantity: req.body.quantity
                });
                return order.save();
            })
            .then(result => {
                res.status(201).json({
                    message: 'Order stored',
                    createdOrder: {
                        _id: result._id,
                        productId: result.productId,
                        quantity: result.quantity
                    },
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/orders/' + result._id
                    }
                });
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    error: err
                });
            });
}

exports.get_all_orders = (req, res, next) => {
    Order.find()
            .select('_id productId quantity')
            .populate('productId', 'name price')
            .exec()
            .then(docs => {
                res.status(200).json({
                    count: docs.length,
                    orders: docs.map(doc => {
                        return {
                            _id: doc._id,
                            productId: doc.productId,
                            quantity: doc.quantity,
                            request: {
                                type: 'GET',
                                url: 'http://localhost:3000/orders/' + doc._id
                            }
                        }
                    })

                });
            })
            .catch(err => {
                res.status(500).json({
                    error: err
                })
            });
}

exports.get_order_by_id = (req, res, next) => {
    const id = req.params.orderId;
    Order.findById(id)
            .select('_id productId quantity')
            .populate('productId')
            .exec()
            .then(order => {
                if (!order) {
                    return res.status(404).json({
                        message: 'Order not found'
                    })
                }
                res.status(200).json({
                    _id: order._id,
                    productId: order.productId,
                    quantity: order.quantity,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/orders/' + order._id
                    }
                })
            })
            .catch(err => {
                res.status(500).json({
                    error: err
                })
            });
}

exports.delete_order = (req, res, next) => {
    const id = req.params.orderId;
    Order.remove({_id: id})
            .exec()
            .then(result => {
                res.status(200).json({
                    message: 'Order has been deleted',
                    request: {
                        type: 'POST',
                        url: 'http://localhost:3000/products',
                        body: {
                            productId: 'ID',
                            quantity: 'Number',
                        }
                    }
                });
            })
            .catch(error => {
                res.status(500).json({
                    error: error
                });
            });
}