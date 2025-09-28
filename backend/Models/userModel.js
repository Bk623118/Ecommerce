const express = require("express")
const mongoose = require("mongoose")
const validator = require("validator")
const bcrypt = require("bcrypt")
 const crypto = require("crypto");

const userModelSchema = new mongoose.Schema({

    name: {
        type : String,
        required : [true , "Please enter your name"],
        maxlength : [25 , "Your name cannot exceed 30 characters"],
        minlength : [4 , "Your name should have more than 4 characters"],

},
    email:{
        type : String,
        required : [true , "Please enter your email"],
        unique : true,
        validate : [validator.isEmail , "Please enter a valid email"]
    },
    password:{
        type:String,
        required:[true,"Please enter your password"],
        minlength:[8,"Your password must be longer than 8 characters"],
        select:false
    },
    avatar:{
        public_id:{
            type:String,
            required:true
        },
        url:{
            type:String,
            required:true
        },
        role:{
            type:String,
            default:"user"
        }

        

    }, 

    resetPasswordToken:String,
        resetPasswordExpire:Date





},{ timestamps: true})

//Hashing password

userModelSchema.pre("save",async function(next){
   
    if(!this.isModified("password")){
         return next()
    }
     this.password = await bcrypt.hash(this.password,10)
       next()   
     
})
//verify password
userModelSchema.methods.comparePassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password)
}

userModelSchema.methods.generateResetPasswordToken = function(){
   
    const resetToken = crypto.randomBytes(20).toString("hex");
    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // Token valid for 15 minutes
    return resetToken;

}

module.exports = mongoose.model("User", userModelSchema)