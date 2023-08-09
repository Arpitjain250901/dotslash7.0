const Product=require("../models/productmodel");
const ErrorHandlers = require("../utils/errorhander");
const catchAsyncerrors=require("../middleware/catchAsyncErrors");
const Apifeatures = require("../utils/apifeatures");
const cloudinary = require("cloudinary");



//create product --Admin route
exports.createProduct=async (req,res,next) => {
 
  let images = [];

  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }

  const imagesLinks = [];

  for (let i = 0; i < images.length; i++) {
    const result = await cloudinary.v2.uploader.upload(images[i], {
      folder: "products",
    });

    imagesLinks.push({
      public_id: result.public_id,
      url: result.secure_url,
    });
  }

  req.body.images = imagesLinks;
  req.body.user = req.user.id;
   // req.body.user = req.user._id;  
    const product=await Product.create(req.body);
    
    res.status(201).json({
      success:true,
      product
    });
  
  };

//get product details

exports.getProductDetails = catchAsyncerrors(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
  
   
    if(!product)
    {
        return next(new ErrorHandlers("Product not found", 404));
    }
    res.status(200).json({
      success: true,
      product,
     
    });
  }
  
);
//get ALL product 
exports.getAllProducts= catchAsyncerrors(async(req,res,next) => {
 
  //return next(new ErrorHandlers("this is my temp error",404));
console.log("hello");
 const resultperpage=8;
 const productcount=await Product.countDocuments();

 const apifeatures=new Apifeatures(Product.find(),req.query)
 .search()
 .filter();

 let products=await apifeatures.query;
 
  const filteredProductsCounts = products.length;
    apifeatures.pagination(resultperpage);

//  let products=await apifeatures.query;
products = await  apifeatures.query.clone();
 //products=await apifeatures.query;



    res.status(200).json({
       success:true,
       products,
       productcount,
       resultperpage,
       filteredProductsCounts
    });
});

// Get All Product (Admin)
exports.getAdminProducts = catchAsyncerrors(async (req, res, next) => {
  const products = await Product.find();

  res.status(200).json({
    success: true,
    products,
  });
});
 
//update product --Admin

exports.updateProduct=catchAsyncerrors(async (req,res,next) => {

    let product=Product.findById(req.params.id);

    if(!product)
    {
        return next(new ErrorHandlers("Product not found", 404));
    }

    // Images Start Here
  let images = [];

  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }

  if (images !== undefined) {
    // Deleting Images From Cloudinary
    for (let i = 0; i < product.images.length; i++) {
      await cloudinary.v2.uploader.destroy(product.images[i].public_id);
    }

    const imagesLinks = [];

    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.v2.uploader.upload(images[i], {
        folder: "products",
      });

      imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }

    req.body.images = imagesLinks;
  }


    product=await Product.updateOne({_id:req.params.id},req.body,{
        new:true,
        runValidators:true,
        useFindAndModify:false
    });

    res.status(200).json({
         
        success:true,
        product
    })


}
);
//delete product --Admin

exports.deleteproduct=catchAsyncerrors(async(req,res,next) => {

    const product=await Product.findById(req.params.id);

    // if(!product)
    // {
    //     return res.status(500).json({
    //         success:false,
    //         message:"product not found"
    //     })
    // }

    if(!product)
    {
      console.log("djhfhf");
        return next(new ErrorHandlers("Product not found", 404));
    }
    console.log("dfjddj");
 // Deleting Images From Cloudinary
  for (let i = 0; i < product.images.length; i++) {
    await cloudinary.v2.uploader.destroy(product.images[i].public_id);
  }



    await product.deleteOne({_id:req.params.id});

    res.status(200).json({
        success:true,
        message:"product deleted"
    })
});

/****************************/

//create new review or update the review

exports.createandupdatereview=catchAsyncerrors(async(req,res,next) => {

    const {rating,comment,productId}=req.body;

    const review={
        user:req.user._id,
        name:req.user.name,
        rating:Number(rating),
        comment,
    }

    const product= await Product.findById(productId);
     
    const isReviewed=product.reviews.find(rev => rev.user.toString() ===req.user._id);



    if(isReviewed){
       
     product.reviews.forEach(rev => {
        
        if(rev.user.toString() ===req.user._id)
        {
        rev.rating=rating;
        rev.comment=comment;
        }

     })

    }
    else{
        product.reviews.push(review);
        product.numOfReviews=product.reviews.length;
    }


    let avg = 0;

    product.reviews.forEach((rev) => {
      avg += rev.rating;
    });
  
    product.ratings = avg / product.reviews.length;
  
    await product.save({ validateBeforeSave: false });
  
    res.status(200).json({
      success: true,
      message:"review added"
    });
    
});

// Get All Reviews of a product
exports.getProductReviews = catchAsyncerrors(async (req, res, next) => {
    const product = await Product.findById(req.query.id);//product id
  
    if (!product) {
      return next(new ErrorHandlers("Product not found", 404));
    }
  
    res.status(200).json({
      success: true,
      reviews: product.reviews,
    });
});



// Delete Review
exports.deleteReview = catchAsyncerrors(async (req, res, next) => {
    const product = await Product.findById(req.query.productId);
  
    if (!product) {
      return next(new ErrorHandlers("Product not found", 404));
    }
  
    const reviews = product.reviews.filter(
      (rev) => rev._id.toString() !== req.query.id.toString()
    );
  
    let avg = 0;
  
    reviews.forEach((rev) => {
      avg += rev.rating;
    });
  
    let ratings = 0;
  
    if (reviews.length === 0) {
      ratings = 0;
    } else {
      ratings = avg / reviews.length;
    }
  
    const numOfReviews = reviews.length;
  
    await Product.findByIdAndUpdate(
      req.query.productId,
      {
        reviews,
        ratings,
        numOfReviews,
      },
      {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      }
    );
  
    res.status(200).json({
      success: true,
    });
  });











