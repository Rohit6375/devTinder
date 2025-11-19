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
            const token=await jwt.sign({_id:user._id},"Rohit@7727");
            res.cookie("token",token);
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

//get user by email
app.get("/user",async(req,res)=>{
    const userEmail=req.body.emailId;
    try {
        const user=await User.findOne({emailId:userEmail});
        if(!user){
            res.status(400).send("user not found");
        }
        else{
            res.send(user);
        }
    } catch (error) {
        res.status(400).send("something went wrong");
    }
})

//Feed API - GET/feed -  get all the users from the database

app.get("/feed",async(req,res)=>{
    try {
        const users=await User.find({});
        if(users.length>0){
            res.send(users);
        }
        else{
            res.send("database is empty");
        }
    } catch (error) {
        res.status(400).send("something went wrong");
    }
})

//find by Id
app.get("/byid",async(req,res)=>{
    const userId=req.body._id;

    const user=await User.findById(userId);
    console.log(user);
    res.send(user);
});

//find by id and delete user
app.delete("/user",async(req,res)=>{
    const userId=req.body.id;
    try {
        // const user=await User.findByIdAndDelete({_id:userId})
        const user=await User.findByIdAndDelete(userId);
        res.send("user deleted successfully");
    } catch (error) {
        res.status(400).send("something went wrong");
    }
})
//find user by id and update

app.patch("/user/:userId",async(req,res)=>{
    const userId=req.params?.userId;
    const data=req.body;
    try {
        const ALLOWED_UPDATES=["firstName","photoUrl","about","gender","age","skills"];
        const isUpdateAllowed=Object.keys(data).every((k)=>ALLOWED_UPDATES.includes(k));
        if(!isUpdateAllowed){
            throw new Error("Update Not Allowed");
        }
        if(data.skills.length>10){
            throw new Error("skills can't be more than 10");
        }
     const user=   await User.findByIdAndUpdate(userId,data,
        {returnDocument:"after",
            runValidators:true

        }); //before
    //  console.log(user);
        res.send("user updated successfully");
    } catch (error) {
        res.status(400).send("something went wrong "+error.message);
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

