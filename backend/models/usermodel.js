const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt=require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");


const userSchema=new mongoose.Schema({
    
    name:{
        type:String,
        required:[true,"please enter name"],
        maxLength:[30,"name cannot exceed 30 characters"],
        meinLength:[4,"name shoukd have more then five characters"]
    },

    email:{
        type:String,
        required:[true,"please enter email"],
        unique:true,
        validate:[validator.isEmail,"Please enter a valid email"]
    },

    password:{
        type:String,
        required:[true,"please enter a Password"],
        minLength:[8,"Password shoukd have more then 8 characters"],
        select:false
    },

    avatar:{
            public_id: {
              type: String,
              required: true,
            },
            url: {
              type: String,
              required: true,
            }
          },


       role:{
        type:String,
        default:"user"
       },
       createdAt: {
        type: Date,
        default: Date.now,
      },


       resetPasswordToken:String,
       resetPasswordExpire:Date,
});


userSchema.pre("save",async function(next) {
    
     if(!this.isModified("password"))
     {
        next();
     }
    this.password=await bcrypt.hash(this.password,10);
})


//JWT TOKEN
userSchema.methods.getJWTToken=function(){

    return jwt.sign({id:this._id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRE,
    });

}

// Compare Password

userSchema.methods.comparePassword = async function (enteredpassword) {
    return await bcrypt.compare(enteredpassword,this.password);
  };


//genertating password reset token
//buffer to string ==hex
userSchema.methods.getResetPasswordToken = function () {
  // Generating Token
  const resetToken = crypto.randomBytes(20).toString("hex");

  // Hashing and adding resetPasswordToken to userSchema
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

  return resetToken;
};


module.exports=mongoose.model("User",userSchema);
