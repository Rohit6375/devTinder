const express=require('express');
const userRouter=express.Router();
const {userAuth}=require('../middlewares/auth');
const ConnectionRequestModel=require('../models/connectionRequest');

const USER_SAFE_DATA="firstName lastName gender age about skills photoUrl";

userRouter.get("/user/requests/received",userAuth,async(req,res)=>{
       try {
        const loggedInUser=req.user;
        // to get all connection requests i need to write a query that loggedInUser should be the toUserId(user) 
        //who so has sent req to toUserId, toUser can see all the request (only those whose status is interested can't see someone's request if he has ignored me)
        
        const connectionRequests=await ConnectionRequestModel.find({
            toUserId:loggedInUser._id,
            status:"interested"
        }).populate("fromUserId",["firstName","lastName","gender","age"]);
        res.json({
            message:"Data fetched successfully",
            data:connectionRequests
        })
       } catch (error) {
        res.status(400).send("ERROR "+error.message);
       }
});

userRouter.get("/user/connections",userAuth,async(req,res)=>{
    try {
        const loggedInUser=req.user;
        const connectionRequests=await ConnectionRequestModel.find({
            $or:[
                 { toUserId:loggedInUser._id,
            status:"accepted"},
            {fromUserId:loggedInUser._id,status:"accepted"}
            ],
        }).populate("fromUserId",USER_SAFE_DATA).populate("toUserId",USER_SAFE_DATA);
        console.log(connectionRequests);
        const data=connectionRequests.map((row)=>{
            if(row.fromUserId._id.toString()===loggedInUser._id.toString()){
                return row.toUserId;
            }
            return row.fromUserId;
        })
        res.json({
           data
        })
    } catch (error) {
        res.status(400).send("ERROR "+error.message);
    }
})


userRouter.get("/feed",userAuth,async(req,res)=>{
    try {
        const loggedInUser=req.user;
        const connectionRequests=await ConnectionRequestModel.find({
            $or:[
                {fromUserId:loggedInUser._id},
                {toUserId:loggedInUser._id}
            ]
        }).select("fromUserId toUserId");
        res.send(connectionRequests);

    } catch (error) {
        res.status(400).send("ERROR "+error.message);
    }
})


module.exports=userRouter;