const HandleAsyncError = (myErrorFun)=>(req, res, next) => {
    Promise.resolve(myErrorFun(req,res, next))
        .catch(next); // Passes any error to the next middleware (error handler)
}

module.exports = HandleAsyncError;