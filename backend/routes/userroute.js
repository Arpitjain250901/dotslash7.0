const express=require('express');
const { registerUser, loginUser, logout, forgotpassword, resetpassword, getuserDetails, updatePassword, updateProfile, getAllUser, getSingleUser, updateUserRole, deleteUser } = require('../controller/usercontroller');
const { isAunthenticatedUser, authorizedRoles } = require('../middleware/auth');



const router=express.Router();

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);

router.route('/password/forgot').post(forgotpassword);

router.route('/password/reset/:token').put(resetpassword);


router.route('/logout').get(logout);

router.route('/me').get(isAunthenticatedUser,getuserDetails);

router.route('/password/update').put(isAunthenticatedUser,updatePassword);

router.route('/me/update').put(isAunthenticatedUser,updateProfile);

router.route('/admin/users').get(isAunthenticatedUser,authorizedRoles("admin"),getAllUser);

router.route('/admin/user/:id')
.get(isAunthenticatedUser,authorizedRoles("admin"),getSingleUser)
.put(isAunthenticatedUser,authorizedRoles("admin"),updateUserRole)
.delete(isAunthenticatedUser,authorizedRoles("admin"),deleteUser);


//router.route('/admin/update/role/:id').put(isAunthenticatedUser,authorizedRoles("admin"),updateUserRole);


//router.route('/admin/delete/user/:id').put(isAunthenticatedUser,authorizedRoles("admin"),deleteUser);

module.exports=router;