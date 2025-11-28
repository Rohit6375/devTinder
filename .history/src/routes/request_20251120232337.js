const express=require('express');

const requestRouter=express.Router();
const {userAuth}=require('../middlewares/auth');
// POST sendConnectionRequest
requestRouter.post("/sendConnectionRequest",userAuth,async(req,res)=>{
    try {
        const user=req.user;
        if(!user){
            throw new Error("user not found")
        }
        res.send(user.firstName+" sent the connection request");
    } catch (error) {
        res.status(400).send("ERROR : "+error.message);
        }
    

})