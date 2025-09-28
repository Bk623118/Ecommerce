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

const requestPassowrdReset = handleAsyncError(async(req,res,next)=>{
    const {email} = req.body;
    const user = await User.findOne({email})
    if(!user){
        return next(new HandleError("User not found with this email",400))
    }
    let resettoken
    try{
      resettoken = user.generateResetPasswordToken();
      await user.save({validateBeforeSave:false});

    }catch(error){
      next(new HandleError("could not save reset token,please try again later",500))

    }
    const resetPasswordUrl = `http://localhost:/api/v1/reset/${resettoken}`;
    const message = `Your password reset token is as follow:\n\n${resetPasswordUrl}\n\n this link will expire in 15 minutes.`
   try{

    //send Email
    await sendEmail({
        email:user.email,
        subject:"Ecommerce password recovery",
        message
    })
    res.status(200).json({success:true,message:`Email sent to ${user.email} successfully`})
    
   }catch(error){
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({validateBeforeSave:false});
    return next(new HandleError("error in sending email,please try again later",500))
   }
})

const resetPassword = handleAsyncError(async(req,res,next)=>{
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire:{$gt:Date.now()}
    })
    if(!user){
        return next(new HandleError("Reset password token is invalid or has been expired",400))
    }
    if(req.body.password !== req.body.confirmPassword){
        return next(new HandleError("password does not match",400))
    }
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    sendToken(user,200,res);
    
}
)

//Get user details
const getUserDetails = handleAsyncError(async(req,res,next)=>{
const user = await User.findById(req.user.id);
res.status(200).json({success:true,user})
})

const updatePassword = handleAsyncError(async(req,res,next)=>{
    const user = await User.findById(req.user.id).select("+password");
    const isMatch = await user.comparePassword(oldPassword);
    if(!isMatch){
        return next(new HandleError("old password is incorrect",400))
    }
    if(newPassword !== confirmPassword){
        return next(new HandleError("password does not match",400))
    }
    user.password = newPassword;
    await user.save();
    sendToken(user,200,res);

})

const updateUserProfile = handleAsyncError(async(req,res,next)=>{
    const {name,email} = req.body;
    const updateUserProfile={
        name,
        email
    }
   const user = await User.findById(req.user.id);
   updateUserDetails = await User.findByIdAndUpdate(req.user.id,updateUserProfile,{
    new:true,
    runValidators:true,
   })
  res.status(200).json({sucess:true,message:"profile updated successfully",user})



})

//admin-Getting User information
const getUserList= handleAsyncError(async(req,res,next)=>{
    const user = User.find();
    res.status(200).json({success:true,user})

})

//admin - get single user details
const getSingleUser= handleAsyncError(async(req,res,next)=>{
    const user = User.findById(req.params.id);
    res.status(200).json({success:true,user})

})


module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  requestPassowrdReset,
  resetPassword,
  getUserDetails,
  updatePassword,
  updateUserProfile,
  getUserList
  

}