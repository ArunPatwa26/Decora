const express = require('express');
const router = express.Router();
const upload = require('../config/multer');
const {
  addProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  getProductsByCategory,
  searchProduct
} = require('../Controller/ProductController');

// POST Route to add a product
router.post("/add-product", upload.array("files", 10), addProduct);

// GET Route to fetch all products
router.get('/all', getAllProducts);

// GET Route to fetch a product by ID
router.get('/:id', getProductById);
router.put('/:id', upload.single('files'), updateProduct);
router.get('/category/:category', getProductsByCategory);
router.get('/search/:key',searchProduct)


module.exports = router;
