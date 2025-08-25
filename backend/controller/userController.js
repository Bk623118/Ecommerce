const HandleAsyncError = require("../middleware/handleAsyncError");
const User = require("../Models/userModel");
const HandleError = require("../utils/handleError");
const handleAsyncError = require("../middleware/handleAsyncError");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");


const registerUser = HandleAsyncError(async(req , res, next)=>{
  const {name , email , password} = req.body;
   const user = await User.create({
    name,
    email,
    password,
    avatar:{
        public_id:"this is a sample id",
        url:"profilepicUrl"
    }
   })
   res.status(201).json({ success:true, user})  

})


const loginUser = handleAsyncError(async(req,res,next)=>{
const {email,password} = req.body;
if(!email || !password){
    return next(new HandleError("email and password cannot empty",400))
}
 
const user = await User.findOne({email}).select("+password");
if(!user){
    return next(new HandleError("Invalid email or password",401))
}
const isMatch = await bcrypt.compare(password,user.password)
        if(!isMatch){
            return res.status(401).json({message:"invalid credentials"})
        }
        const token = jwt.sign(
            {id:user._id,role:user.avatar.role},
            process.env.JWT_SECRET, 
            {expiresIn:"24h"}
        )
         return res.status(200).json({
            message:"login successful",token,user}
            )
})


const logoutUser = HandleAsyncError(async (req, res, next) => {
  // Client should remove token from localStorage/memory
  return res.status(200).json({ success: true, message: "Logged out" });
});


module.exports = {
  registerUser,
  loginUser,
  logoutUser

};