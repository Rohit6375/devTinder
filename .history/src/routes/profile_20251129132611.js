const express=require('express');
const{userAuth}=require('../middlewares/auth');
const bcrypt=require('bcrypt');

const{validateEditProfileData,validatePassword}=require('../utils/validation');

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
    try{
   if(!validateEditProfileData(req)){
    throw new Error("Invalid Edit Request");
   } 
   const loggedInUser=req.user;
   Object.keys(req.body).forEach((key)=>(loggedInUser[key]=req.body[key]));
   await loggedInUser.save();
   res.json({message:`${loggedInUser.firstName},your profile is updated successfully`,
data:loggedInUser
});
    }
    catch(error){
        res.status(400).send("ERROR "+error.message);
    }
})

//update password
profileRouter.patch("/profile/password",userAuth,async(req,res)=>{
    try {
        
        const {oldPassword,password:newPassword}=req.body;

        if(!oldPassword) throw new Error("old password is required");
        if(!newPassword) throw new Error("new password is required");



          const loggedInUser=req.user;
         // compare old password
        const isMatch=await bcrypt.compare(oldPassword,loggedInUser.password);
        if(!isMatch){
            throw new Error("Old password is Incorrect");
        }

        validatePassword(newPassword);

      

       
         // hash new password
        const hashedPassword= await bcrypt.hash(newPassword,10);

        loggedInUser.password=hashedPassword;

      await  loggedInUser.save({ runValidators: true });

      res.send("password updated successfully");

        
    } catch (error) {
        res.status(400).send("Error : "+error.message);
    }
})

module.exports=profileRouter;