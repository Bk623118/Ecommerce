

const jwt = require("jsonwebtoken");
const HandleError = require("../utils/handleError");
const ensureAuthenticated = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  console.log("Token:", token);

  if (!token) {
    console.log("Authorization Header:", req.headers.authorization)
    return res.status(401).json({ message: "No token provided " })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; 
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

const roleBasedAccess= (...roles)=>{
 return (req,res,next)=>{
    if(!roles.includes(req.user.role)){
        return  next(new HandleError(`Role - ${req.user.role} You are not authorized to access this resource`,403));
    }
    next();
 }   
}






// const isAdmin = (req, res, next) => {
//   if (req.user?.role !== "admin") {
//     return res.status(403).json({ message: "Access denied: Admins only" });
//   }
//   next();
// };

module.exports = {
  ensureAuthenticated,
  roleBasedAccess
}
