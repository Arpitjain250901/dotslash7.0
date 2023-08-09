const express=require("express");
const { newOrder, getSingleOrder, myOrders, getAllOrders, updateOrder, deleteOrder } = require("../controller/ordercontroler");
const { isAunthenticatedUser, authorizedRoles } = require("../middleware/auth");




const router=express.Router();

router.route("/order/new").post(isAunthenticatedUser,newOrder);

router.route("/order/:id").get(isAunthenticatedUser,getSingleOrder);
router.route("/order").get(isAunthenticatedUser,myOrders);


router
  .route("/admin/orders")
  .get(isAunthenticatedUser, authorizedRoles("admin"), getAllOrders);

router
  .route("/admin/order/:id")
  .put(isAunthenticatedUser, authorizedRoles("admin"), updateOrder)
  .delete(isAunthenticatedUser, authorizedRoles("admin"), deleteOrder);



module.exports=router;