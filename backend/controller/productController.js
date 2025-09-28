const HandleError = require('../utils/handleError');
const handleAsyncError = require('../middleware/handleAsyncError');
const Product = require('../Models/productModel');
const APIFunctionality = require('../utils/apiFunctionality');

//create product

const createProduct = handleAsyncError(async(req, res ) => {
   const product = await Product.create(req.body);
    console.log(req.body);
res.status(201).json({ success: true, product }); 
}
)

//get all products

const getAllProducts =handleAsyncError( async(req,res,next) => {
    const resultPerPage = 8;
    const apiFeatures = new APIFunctionality(Product.find(), req.query).search().filter();
    const filterdQuery = apiFeatures.query.clone();
    const productCount = await Product.countDocuments();
    const totalPages = Math.ceil(productCount / resultPerPage);
    const page = Number(req.query.page) || 1;
    if(page > totalPages&&productCount > 0) {
        return next(new HandleError("Page not found", 404));
    }

    apiFeatures.pagination(resultPerPage);
    const products = await apiFeatures.query
    if(!products && products.length === 0) {
        return next(new HandleError("No products found", 404));
    }
res.status(200).json({ success: true, products , productCount,totalPages,resultPerPage, currentPage: page });
})   

//update product

const updateProduct = handleAsyncError( async(req,res)=>{

    let product = await Product.findById(req.params.id)
    if(!product){
        return next(new HandleError("Product not found", 404)); // Using custom error handler
    }
    product = await Product.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators: true
     })
    res.status(200).json({ success: true, product });
     })




 //Delete product
 const deleteProduct =handleAsyncError( async(req,res) =>{
 let product = await Product.findById(req.params.id);
    if(!product){
        return next(new HandleError("Product not found", 404)); // Using custom error handler
    }
    product =await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Product deleted successfully" });
 })

 //Accessing single product
const getSingleProduct =handleAsyncError(async(req,res,next) =>{
        let product = await Product.findById(req.params.id);
     if(!product){
       return next(new HandleError("Product not found", 404)); // Using custom error handler
    }
    res.status(200).json({ success: true, product });
    
    
})


//get all products (Admin)
const getAdminProducts = handleAsyncError(async(req,res,next)=>{
    const products =await Product.find();
    res.status(200).json({success:true,products})
})





module.exports = {      
   createProduct,
   getAllProducts,
   updateProduct,
   deleteProduct,
   getSingleProduct,
   getAdminProducts
}



