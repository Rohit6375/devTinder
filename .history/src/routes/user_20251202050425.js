const express=require('express');
const userRouter=express.Router();
const {userAuth}=require('../middlewares/auth');
const ConnectionRequestModel=require('../models/connectionRequest');


userRouter.get("/user/requests/recieved",userAuth,async(req,res)=>{
       try {
        
       } catch (error) {
        res.status(400).send("ERROR "+error.message);
       }
})



module.exports=userRouter;