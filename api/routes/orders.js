const express = require('express');
const router = express.Router();

const orderController = require('../controllers/orderController');

router.post('/', orderController.create_order);

router.get('/', orderController.get_all_orders);

router.get('/:orderId', orderController.get_order_by_id);

router.delete('/:orderId', orderController.delete_order);

module.exports = router;