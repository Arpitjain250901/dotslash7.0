// const express=require('express');
// const moongoose=require('mongoose');
const app=require("./app");
const dotenv=require('dotenv');
const connectDatabase=require("./config/database");
const cloudinary = require("cloudinary");

//uncaught error //reference error
// console.log(arpit)
process.on("uncaughtException",(err) => {
   
    console.log(`Error: ${err.message}`);
       console.log('Shutting down the server');

      process.exit(1);
})


//config
dotenv.config({ path: "backend/config/config.env" });

//connecting to database

connectDatabase();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });







const server=app.listen(process.env.PORT,() => {
    console.log(`Server is working on http://localhost:${process.env.PORT}`);

});




//unhandled promise rejection
process.on("unhandledRejection",err => {

     console.log("maro mujhe");
       console.log(`Error: ${err.message}`);
       console.log('Shutting down the server');

       server.close(() => process.exit(1));
    });

//status 1 means server close abnormally


