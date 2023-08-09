
const express=require('express');
const { getAllProducts,
  createProduct ,
  updateProduct,
  deleteproduct,
  getProductDetails,
   createandupdatereview, 
  deleteReview,
   getProductReviews,
   getAdminProducts
  } = require('../controller/productcontroller');
const { isAunthenticatedUser,authorizedRoles } = require('../middleware/auth');


const router=express.Router();

router.route('/products').get(getAllProducts);

router
  .route("/admin/products")
  .get(isAunthenticatedUser, authorizedRoles("admin"), getAdminProducts);

router.route('/admin/products/new').post(isAunthenticatedUser,authorizedRoles("admin"),createProduct);
router.route('/admin/products/:id').put(isAunthenticatedUser,authorizedRoles("admin"),updateProduct).delete(isAunthenticatedUser,authorizedRoles("admin"),deleteproduct);

router.route("/products/:id").get(getProductDetails);

router.route("/review")
  .put(isAunthenticatedUser,createandupdatereview)
 

  router.route("/reviews")
  .get(getProductReviews)
  .delete(isAunthenticatedUser, deleteReview);



module.exports=router;