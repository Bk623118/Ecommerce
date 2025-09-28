const express = require('express');
const {ensureAuthenticated,roleBasedAccess} = require('../middleware/authMiddleware');
const { getAllProducts,createProduct, updateProduct, deleteProduct,getSingleProduct } = require('../controller/productController');
const router = express.Router();

    

router.route("/products").get(ensureAuthenticated,getAllProducts)
router.route("/admin/product/create").post(ensureAuthenticated,roleBasedAccess("admin"),createProduct);
router.route("/admin/products/:id").put(ensureAuthenticated,roleBasedAccess("admin"),updateProduct).delete(ensureAuthenticated,roleBasedAccess("admin"),deleteProduct)
router.route("/product/:id").get(ensureAuthenticated,getSingleProduct)
 





module.exports = router