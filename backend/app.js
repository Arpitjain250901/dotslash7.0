const express=require('express');
const dotenv=require('dotenv');
const cookieParser = require("cookie-parser");
const bodyparser=require("body-parser");
const fileUpload=require("express-fileupload");
const app=express();


dotenv.config({ path: "backend/config/config.env" });


const errorMiddleware = require("./middleware/error");


// app.use(express.json());
app.use(express.json({ limit: "50mb" })); 
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());
app.use(bodyparser.urlencoded({extended:true}));
app.use(fileUpload());
//route import

const product = require("./routes/productroute");
const user=require("./routes/userroute");
const order=require("./routes/orderroutes");
const payment = require("./routes/paymentRoutes");

app.use("/api/v1",product);
app.use("/api/v1",user);
app.use("/api/v1/",order);
app.use("/api/v1", payment);

//Middleware for error
app.use(errorMiddleware);



module.exports=app