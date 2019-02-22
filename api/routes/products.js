const express = require('express');
const router = express.Router();
const multer = require('multer');

const checkAuth = require('../middleware/check-auth');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, new Date() + file.originalname);
    }
});
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});

const productController = require('../controllers/productController');

router.post('/', checkAuth, upload.single('productImage'), productController.create_product);

router.get('/', productController.get_all_products);

router.get('/:productId', productController.get_product_by_id);

router.patch('/:productId', productController.update_product);

router.delete('/:productId', productController.delete_product);

module.exports = router;