const HandleError = require("../utils/handleError");

const error = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || 'Internal Server Error';
    
    if(err.name === "CastError"){
        const message = `Resource not found. Invalid: ${err.path}`;
        err = new HandleError(message, 404);
    }

    if(err.code === 11000){
        const message = `This ${Object.keys(err.keyValue)} is already registered Please login to continue`;
        err = new HandleError(message, 400);
    }

    res.status(err.statusCode).json({
        success: false,
        message: err.message,
    })
     

}
module.exports = error;