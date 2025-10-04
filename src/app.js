const express=require("express");
const {adminAuth,userAuth}=require("./middlewares/auth");

const app=express();


app.get("/getUserData",(req,res,next)=>{
    //logic of DB call and get users
    try {
         throw new Error("some random error");
    res.send("User data sent");
    } catch (error) {
        res.status(500).send("Some error contact support")
    }

   
})

app.use("/",(err,req,res,next)=>{
    if(err){
        res.status(500).send("Something Went Wrong");
    }
})


app.listen(4000,()=>{
    console.log("server running on port 4000")
})

