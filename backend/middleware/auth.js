const ErrorHandler = require("../utils/errorhander");
const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require("jsonwebtoken");
const User=require("../models/usermodel");
exports.isAunthenticatedUser=catchAsyncErrors(async (req,res,next) => {

    const {token}=req.cookies;
   
    if(!token)
    {
        console.log("hfef");
        return next(new ErrorHandler("please login to access this resource",401));
    }

    const decodedData = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decodedData.id);
  
    next();   
});


exports.authorizedRoles=(...roles) => {

    return (req,res,next) => {


        if(!roles.includes(req.user.role)){
           return next( new ErrorHandler(`Role: ${req.user.role} is not allowed to access this resorce`,403));
        }

        next();

    }
}




