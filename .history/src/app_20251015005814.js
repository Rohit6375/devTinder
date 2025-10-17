const express=require("express");
const {adminAuth,userAuth}=require("./middlewares/auth");

const connectDB=require("./config/database");


const app=express();
const User=require('./models/user');

app.post("/signup",async(req,res)=>{
    const user=new User({
        firstName:"Rohit",
        lastName:"Morya",
        emailId:"morya@gmail.com",
        password:"Rohit@123"
    });
    await user.save();
    res.send("user created successfully");
})


connectDB().then(()=>{
    console.log("Database connected successfully");
    app.listen(4000,()=>{
    console.log("server running on port 4000")
})

}).catch((err)=>{
    console.error("database can't be connected");
})

