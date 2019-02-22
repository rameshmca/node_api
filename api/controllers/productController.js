const mongoose = require('mongoose');
const Product = require('../models/product');

exports.create_product = (req, res, next) => {
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    });
    product.save()
            .then(result => {
                res.status(201).json({
                    message: 'Product Created Successfully',
                    createdProduct: {
                        _id: result._id,
                        name: result.name,
                        price: result.price,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/products/' + result._id
                        }
                    }
                })
            })
            .catch(err => {
                console.log(err);
                res.status(500).json(err)
            });
}

exports.get_all_products = (req, res, next) => {
    Product.find()
            .select('_id name price')
            .exec()
            .then(docs => {
                const response = {
                    count: docs.length,
                    products: docs.map(doc => {
                        return {
                            _id: doc.id,
                            name: doc.name,
                            price: doc.price,
                            productImage: doc.productImage,
                            request: {
                                type: 'GET',
                                url: 'http://localhost:3000/products/' + doc.id
                            }
                        };
                    })
                };
                res.status(200).json(response);
            })
            .catch(res => {
                res.status(500).json({error: err});
            });
}

exports.get_product_by_id = (req, res, next) => {
    const id = req.params.productId;
    Product.findById({_id: id})
            .select('name price _id productImage')
            .exec()
            .then(doc => {
                if (doc) {
                    res.status(200).json({
                        _id: doc._id,
                        name: doc.name,
                        price: doc.price,
                        productImage: doc.productImage,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/products/' + doc._id
                        }
                    });
                } else {
                    res.status(404).json({error: "No valid entry found for given id"});
                }
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({error: err});
            });
}

exports.update_product = (req, res, next) => {
    const id = req.params.productId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Product.update({_id: id}, {$set: updateOps})
            .exec()
            .then(result => {
                res.status(200).json({
                    message: 'Product updated Successfully',
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/products/' + id
                    }
                });
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({error: err});
            });
}

exports.delete_product = (req, res, next) => {
    const id = req.params.productId;
    Product.remove({_id: id})
            .exec()
            .then(result => {
                res.status(200).json({
                    message: 'Product deleted successfully',
                    request: {
                        type: 'POST',
                        body: {
                            name: 'String',
                            price: 'Number'
                        },
                        url: 'http://localhost:3000/products/'
                    }
                });
            })
            .catch(err => {
                console.log(err)
                res.status(404).json({error: err});
            });
}