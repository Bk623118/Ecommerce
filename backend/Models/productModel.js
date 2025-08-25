const express = require('express');
const mongoose = require('mongoose');


const productModelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true , 'Product name is required'],
        trim: true

    },
    price: {
        type: Number,
        required: [true , 'Product price is required'],
        maxlength: [8, 'Price cannot exceed 8 digits']
    },
    description: {
        type: String,
        required: [true , 'Product description is required'],
    },
    ratings:{
        type: Number,
        default: 0  
    },
    image:[
        {
            public_id: {
                type: String,
                required: true
            },
            url: {
                type: String,
                required: true
            }
        }    
    ],
    category: {
        type: String,
        required: [true , 'Product category is required'],
        // enum: {
        //     values: [
        //         'Electronics',
        //         'Clothing',
        //         'Footwear',
        //         'Accessories',
        //         'Home Appliances'
        //     ],
        //     message: 'Please select a valid category'
        // }
    },
    stock: {
        type: Number,
        required: [true , 'Product stock is required'],
        default: 0,
        maxlength: [5 ,"tock cannot exceed 4 digits"],
    },
    numOfReviews: {
        type: Number,
        default: 0
    },
    reviews: [
        {
            name: {
                type: String,
                required: true
            },
            rating: {
                type: Number,
                required: true
            },
            comment: {
                type: String,
                required: true
            },
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    }
    
    
})

module.exports = mongoose.model('Product', productModelSchema);