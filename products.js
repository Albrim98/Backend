const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// GET /api/products - Hämta alla produkter
router.get('/', productController.getAllProducts);

// GET /api/products/:id - Hämta specifik produkt
router.get('/:id', productController.getProductById);

// POST /api/products - Skapa ny produkt
router.post('/', productController.createProduct);

// PUT /api/products/:id - Uppdatera produkt
router.put('/:id', productController.updateProduct);

// DELETE /api/products/:id - Ta bort produkt
router.delete('/:id', productController.deleteProduct);

module.exports = router;