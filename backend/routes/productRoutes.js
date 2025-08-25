const express = require('express');
const ensureAuthenticated = require('../middleware/authMiddleware');
const { getAllProducts,createProduct, updateProduct, deleteProduct,getSingleProduct } = require('../controller/productController');
const router = express.Router();

    

router.route("/products").get(ensureAuthenticated,getAllProducts).post(createProduct);
router.route("/products/:id").put(updateProduct).delete(deleteProduct).get(getSingleProduct)
 





module.exports = router