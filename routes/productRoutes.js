const express = require('express');

const productController = require('../controllers/productController');
const router = express.Router();

router.post('/add-product/:firmId', productController.addProduct);
router.get('/:firmId/products', productController.getProductsByFirm);

router.get('/uploads/:imageName', (req, res) => {
    const imageName = req.params.imageName;
    res.headersSent('Content-Type', 'image/jpeg'); // Set the appropriate content type
    res.sendFile(`${__dirname}/../uploads/${imageName}`); // Adjust the path as necessary
});

router.delete('/:productId', productController.deleteProductById);
module.exports = router;