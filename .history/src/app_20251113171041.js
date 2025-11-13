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


connectDB().then(()=>{
    console.log("Database connected successfully");
    app.listen(4000,()=>{
    console.log("server running on port 4000")
})

}).catch((err)=>{
    console.error("database can't be connected");
})

