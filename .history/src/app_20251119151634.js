const express=require("express");
// const {adminAuth,userAuth}=require("./middlewares/auth");

const connectDB=require("./config/database");
const {validateSignUpData}=require('./utils/validation');

const bcrypt=require('bcrypt');


const app=express();
const User=require('./models/user');
const cookieParser=require('cookie-parser');
const jwt=require('jsonwebtoken');

const{userAuth}=require('./middlewares/auth');

//middleware by xpress
app.use(express.json());
app.use(cookieParser());

app.post("/signup",async(req,res)=>{
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

app.post("/login",async(req,res)=>{
    try {
        const {emailId,password}=req.body;
        const user=await User.findOne({emailId:emailId});
        if(!user){
            throw new Error("Invalid Credentials");
        }
        const isPasswordValid=await bcrypt.compare(password,user.password);
        if(isPasswordValid){
            //create jwt token
            const token=user.getJWT();
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

//get profile
app.get("/profile",userAuth,async(req,res)=>{
    try {
   const user=req.user;
        res.send(user);
    }
    catch(error){
                res.status(400).send("ERROR : "+error.message);

    }
})

// POST sendConnectionRequest
app.post("/sendConnectionRequest",userAuth,async(req,res)=>{
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

app.use("/",(req,res)=>{
    res.send("hello world")
})



connectDB().then(()=>{
    console.log("Database connected successfully");
    app.listen(4000,()=>{
    console.log("server running on port 4000")
})

}).catch((err)=>{
    console.error("database can't be connected");
})

