const catchAsyncerrors=require("../middleware/catchAsyncErrors");

const stripe=require("stripe")("sk_test_51NRRndSFJWvopOadKKXgatcaATUg4zrr9vOJrIytaAhBu9KOMlr58budV1DPhXfMW3JR55BFHXHwi0d8rBiFKh5300bQV9viXw");

exports.processPayment=catchAsyncerrors(async (req,res) => {
        
  //console.log("not");
       const myPayment=await stripe.paymentIntents.create({
              amount:req.body.amount,
              currency:"inr",
              metadata:{
                company:"Ecommerce",
              },
            });

            // console.log(myPayment);
            // console.log(myPayment.client_secret);
    res.status(200)
    .json({
        success:true,
        client_secret:myPayment.client_secret,
    });

  
    

});

exports.sendStripeApiKey = catchAsyncerrors(async (req, res, next) => {
    res.status(200).json({ stripeApiKey: process.env.STRIPE_API_KEY });
  });
