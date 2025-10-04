const express=require("express");
const {adminAuth,userAuth}=require("./middlewares/auth");

const app=express();


app.use("/admin",adminAuth);

// app.use("/user",userAuth)
app.get("/user",(req,res,next)=>{
    res.send("user data sent");
})


app.post("/user/login",(req,res,next)=>{
    res.send("user logged in successfully");
})

app.get("/user/data",userAuth,(req,res,next)=>{
    res.send("user data sent ");
})

app.get("/admin/getAllData",(req,res,next)=>{
   
        res.send("All data sent");
})

app.get("/admin/deleteUser",(req,res,next)=>{
    const token="xyz";
    const isAdminAuthorized=token==="xyz";
    if(isAdminAuthorized){
        res.send("User deleted");
    }
    else{
        res.status(401).send("Unauthorized request");
    }
    
})




app.listen(4000,()=>{
    console.log("server running on port 4000")
})

