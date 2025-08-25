const express = require('express');
const productRouter = require('./routes/productRoutes');
const userRouter = require('./routes/userRoutes');
const error = require('./middleware/error');
const app = express()

app.use(express.json());

app.use("/api/v1", productRouter);
app.use("/api/v1", userRouter);
app.use(error)  

module.exports = app;