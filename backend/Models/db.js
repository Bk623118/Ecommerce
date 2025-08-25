const express = require('express');
const mongoose = require('mongoose')
require('dotenv').config();

const MongoURI = process.env.MongoURI


mongoose.connect(MongoURI).then((data)=>{
    console.log(`mongodb is conncected to ${data.connection.host}`);
 })
