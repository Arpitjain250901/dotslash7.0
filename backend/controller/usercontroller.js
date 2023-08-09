const ErrorHandlers = require("../utils/errorhander");
const catchAsyncerrors=require("../middleware/catchAsyncErrors");
const User=require("../models/usermodel");
const sendToken = require("../utils/JWTtokens");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const cloudinary = require('cloudinary');
const bcrypt=require("bcryptjs");

exports.registerUser = catchAsyncerrors(async (req, res, next) => {
    
  
  const mycloud=await cloudinary.v2.uploader.upload(req.body.avatar,{
       folder:"avatars",
       width:150,
       crop:"scale",
       chunk_size:6000000,
  });

  
    const { name, email, password} = req.body;
  
    const user = await User.create({
      name,
      email,
      password,
      avatar: {
        public_id: mycloud.public_id,
        url: mycloud.secure_url,
      },
    });

    sendToken(user,201,res);

});

exports.loginUser = catchAsyncerrors(async (req, res, next) => {
    
  
    const { email, password } = req.body;
  
   if(!email || !password)
   {
    return next(new ErrorHandlers("Please enter email and password", 400));
   }

   const user= await User.findOne({email}).select("+password");
 
   if(!user)
   {
    return next(new ErrorHandlers("invalid email or password", 401));
   }

  // const ispasswordMatched= await user.comparePassword(password);

  const ispasswordMatched=bcrypt.compareSync(password,user.password);

   if(!ispasswordMatched)
   {
   
    return next(new ErrorHandlers("invalid email or password", 401));
   }

   sendToken(user,200,res);

});


// Logout User
exports.logout = catchAsyncerrors(async (req, res, next) => {
  res.cookie("token", null, {
    expire: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged Out",
  });
});


//forgot password
exports.forgotpassword=catchAsyncerrors(async(req,res,next) => {

  console.log("1st");
 // const { email } = req.body;
   //const user=await User.findOne({email:req.body.email});
   const user= await User.findOne({email:"forgot@gmail.com"});

   console.log(user);
   if(!user)
   {
    console.log("2st");
    return next(new ErrorHandlers("Email doest not exist",404));
   }
  
   console.log("3st");

   //get restpassword token
   const resetToken=user.getResetPasswordToken();
   console.log("4st");
   await user.save({validateBeforeSave:false});
   console.log("5st");
   const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/password/reset/${resetToken}`;
  console.log("6st");
  const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then, please ignore it.`;
 
  try {
    await sendEmail({
      email: user.email,
      subject: `Ecommerce Password Recovery`,
      message,
    });
    console.log("7st");

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    console.log("8st");
    await user.save({ validateBeforeSave: false });
    console.log("dhf");
    return next(new ErrorHandlers(error.message, 500));
  }
});


//reset password 
exports.resetpassword=catchAsyncerrors(async(req,res,next) => {

  //creating token hash
  const resetPasswordToken = crypto
  .createHash("sha256")
  .update(req.params.token)
  .digest("hex");

  const user=await User.findOne({
    resetPasswordToken,
    resetPasswordExpire:{$gt:Date.now()},
  });

  if(!user)
  {
   return next(new ErrorHandlers("Reset password token is invalid or has been  expired",400));
  }


  if(req.body.password!==req.body.confirmpassword)
  {
    return next(new ErrorHandlers("password doesnt match",400));
  }

  user.password=req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  
  await user.save();

  sendToken(user,200,res);
});


exports.getuserDetails=catchAsyncerrors(async (req,res,next) => {

     
   const user=await User.findById(req.user.id);

   res.status(200).json({
    success:true,
    user,
   });

});


// update User password
exports.updatePassword = catchAsyncerrors(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

  if (!isPasswordMatched) {
    return next(new ErrorHandlers("Old password is incorrect", 400));
  }

  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(new ErrorHandlers("password does not match", 400));
  }

  user.password = req.body.newPassword;

  await user.save();

  sendToken(user, 200, res);
});


// update User Profile
exports.updateProfile = catchAsyncerrors(async (req, res, next) => {
  
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
  };

  if (req.body.avatar !== "") {
    const user = await User.findById(req.user.id);

    const imageId = user.avatar.public_id;

    await cloudinary.v2.uploader.destroy(imageId);

    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
      folder: "avatars",
      width: 150,
      crop: "scale",
    });

    newUserData.avatar = {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    };
  }

 

  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
  });
});



// Get all users(admin)
exports.getAllUser = catchAsyncerrors(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    success: true,
    users,
  });
});

// Get single user (admin)
exports.getSingleUser = catchAsyncerrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorHandlers(`User does not exist with Id: ${req.params.id}`)
    );
  }
 
  res.status(200).json({
    success: true,
    user,
  });
});


// update User Role -- Admin
exports.updateUserRole = catchAsyncerrors(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };

  await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
  });
});


// Delete User --Admin
exports.deleteUser = catchAsyncerrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorHandlers(`User does not exist with Id: ${req.params.id}`, 400)
    );
  }

  const imageId = user.avatar.public_id;

  await cloudinary.v2.uploader.destroy(imageId);
 
  await User.deleteOne({_id:req.params.id});

  res.status(200).json({
    success: true,
    message: "User Deleted Successfully",
  });
});









