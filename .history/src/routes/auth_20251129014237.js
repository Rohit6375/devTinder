const express=require('express');
const {validateSignUpData}=require('../utils/validation');

const authRouter=express.Router();
const bcrypt=require('bcrypt');
const User=require('../models/user');


authRouter.post("/signup",async(req,res)=>{
try {

    // validation of data
       validateSignUpData(req);
    
    // encrypt password
    const{firstName,lastName,emailId,password}=req.body;
    
    const hashPassword=await bcrypt.hash(password,10);
    
    //creating new instance of the user model
    const user=new User({
        firstName,
        lastName,
        emailId,
        password:hashPassword
    });

    
        await user.save({runValidators:true});
    res.send("user created successfully");
    } catch (error) {
        res.status(400).send("ERROR : "+error.message);
    }
});

//login api
authRouter.post("/login",async(req,res)=>{
    try {
        const {emailId,password}=req.body;
        const user=await User.findOne({emailId:emailId});
        if(!user){
            throw new Error("Invalid Credentials");
        }
        const isPasswordValid= await user.validatePassword(password);
        if(isPasswordValid){
            //create jwt token
            const token=await user.getJWT();
            res.cookie("token",token,{expires:new Date(Date.now()+8*3600000)});
            res.send("Login Successfull");
        }
        else{
            throw new Error("Invalid Credentials");
        }
    } catch (error) {
        res.status(400).send("ERROR : "+error.message);
    }
})

//logout api
authRouter.post("/logout",async (req,res)=>{
    res.cookie("token",null,{
        expires:new Date(Date.now()),
    });
    res.send("logut successfull");
})


module.exports=authRouter;