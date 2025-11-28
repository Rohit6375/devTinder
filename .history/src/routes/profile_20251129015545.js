const express=require('express');
const{userAuth}=require('../middlewares/auth');

const{validEditProfileData}=require('../utils/validation');

const profileRouter=express.Router();

//get profile
profileRouter.get("/profile/view",userAuth,async(req,res)=>{
    try {
   const user=req.user;
        res.send(user);
    }
    catch(error){
                res.status(400).send("ERROR : "+error.message);

    }
});

//update profile
profileRouter.patch("/profile/edit",userAuth,async(req,res)=>{
    validEditProfileData(req);
})

module.exports=profileRouter;