const express=require('express');
const userRouter=express.Router();
const {userAuth}=require('../middlewares/auth');
const ConnectionRequestModel=require('../models/connectionRequest');


userRouter.get("/user/requests/recieved",userAuth,async(req,res)=>{
       try {
        const loggedInUser=req.user;
        // to get all connection requests i got need to write in query that loggedInUser should be the toUserId(user) 
        //who so has sent req to toUserId, toUser can see all the request (only those whose status is interested can't see someone's request if he has ignored me)
        
        const connectionRequests=await ConnectionRequestModel.find({
            toUserId:loggedInUser._id,
            status:"interested"
        }).populate("fromUserId",["firstName","lastName","gender","age"]);
       } catch (error) {
        res.status(400).send("ERROR "+error.message);
       }
})



module.exports=userRouter;