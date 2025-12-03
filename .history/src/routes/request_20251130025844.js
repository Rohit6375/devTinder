const express=require('express');

const requestRouter=express.Router();
const {userAuth}=require('../middlewares/auth');
const ConnectionRequest=require('../models/connectionRequest');
// POST sendConnectionRequest
requestRouter.post("/request/send/:status/:toUserId",userAuth,async(req,res)=>{
    try {
       const fromUserId=req.user._id;
       const status=req.params.status;
       const toUserId=req.params.toUserId;

       const allowedStatus=["interested",'ignored'];
       if(!allowedStatus.includes(status)){
        return res.json({
            message:`not a valid status ${status}`
        })
       };
    // checking for existing connection request
    const existingConnectionRequest=await ConnectionRequest.findOne({
        $or:[
            {fromUserId,toUserId},
            {fromUserId:toUserId,toUserId:fromUserId}
        ]
    });
    if(existingConnectionRequest){
        return res.status(400).json({
            message:"connection request already exist"
        })
    }
       const connectionRequest=new ConnectionRequest({
        fromUserId,
        toUserId,
        status
       })
       const data=await connectionRequest.save();
       res.json({
        message:`connection request sent successfully`,
        data
       })

    } catch (error) {
        res.status(400).send("ERROR : "+error.message);
        }
    

})

module.exports=requestRouter