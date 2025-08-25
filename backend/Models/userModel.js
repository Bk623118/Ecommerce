const express = require("express")
const mongoose = require("mongoose")
const validator = require("validator")
const bcrypt = require("bcrypt")

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
        },
        resetPasswordToken:String,
        resetPasswordExpire:Date

    } 





},{ timestamps: true})

//Hashing password

userModelSchema.pre("save",async function(){
    this.password = await bcrypt.hash(this.password,10)
    if(!this.isModified("password")){
        next()
    }
})


module.exports = mongoose.model("User", userModelSchema)