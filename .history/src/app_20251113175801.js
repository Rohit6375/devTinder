const express=require("express");
const {adminAuth,userAuth}=require("./middlewares/auth");

const connectDB=require("./config/database");


const app=express();
const User=require('./models/user');

//middleware by xpress
app.use(express.json());

app.post("/signup",async(req,res)=>{

    
    //creating new instance of the user model
    const user=new User(req.body);

    try {
        await user.save();
    res.send("user created successfully");
    } catch (error) {
        res.status(400).send("error saving the user",error.message);
    }
});

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
    const user=await User.findById({_id:userId});
    console.log(user);
    res.send(user);
})

connectDB().then(()=>{
    console.log("Database connected successfully");
    app.listen(4000,()=>{
    console.log("server running on port 4000")
})

}).catch((err)=>{
    console.error("database can't be connected");
})

