const express=require('express');
const router=express.Router();
const {registerUser,authUser,allUsers}= require('../controllers/userController');
const {protect}=require('../middleware/authMiddleware');

//this sytax can be used for chainig of routes
router.route('/').post(registerUser).get(protect,allUsers);

//this can't be used for chaining of routes
router.post('/login',authUser);

module.exports=router;