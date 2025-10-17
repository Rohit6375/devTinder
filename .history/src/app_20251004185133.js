const express=require("express");
const {adminAuth,userAuth}=require("./middlewares/auth");

const connectDB=require("./config/database");


const app=express();



connectDB().then(()=>{
    console.log("Database connected successfully");
    app.listen(4000,()=>{
    console.log("server running on port 4000")
})

}).catch((err)=>{
    console.error("database can't be connected");
})

