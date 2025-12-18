const express=require("express");
// const {adminAuth,userAuth}=require("./middlewares/auth");

const connectDB=require("./config/database");
const jwt=require('jsonwebtoken');
const app=express();
const cookieParser=require('cookie-parser');
const authRouter=require('./routes/auth')
const profileRouter=require('./routes/profile');
const requestRouter=require('./routes/request');
const userRouter=require('./routes/user');

const cors=require('cors');

//handling cors error using cors middleware
app.use(cors());

//middleware by xpress
app.use(express.json());
app.use(cookieParser());

app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);
app.use("/",userRouter);

connectDB().then(()=>{
    console.log("Database connected successfully");
    app.listen(4000,()=>{
    console.log("server running on port 4000")
})

}).catch((err)=>{
    console.error("database can't be connected");
})

