const express = require("express")
const cors = require("cors")
const app = require("./app.js")

require("dotenv").config()
require("./Models/db.js")


const Port =process.env.Port || 8080;

app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.get("/ping",(req,res)=>{
    res.send("pong")
})



process.on("uncaughtException", (err) => {
console.log(`Error: ${err.message}`);
    console.log("Shutting down the server due to uncaught exception");
        process.exit(1);
})



const server = app.listen(Port,()=>{
    console.log(`Server is running on port ${Port}`)
})

process.on("unhandledRejection", (err) => {
    console.log(`Error: ${err.message}`);
    console.log("Shutting down the server due to unhandled promise rejection");
    server.close(() => {
        process.exit(1);
    });
})


