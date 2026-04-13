const express=require("express");
require("dotenv").config();
// const {adminAuth,userAuth}=require("./middlewares/auth");

const connectDB=require("./config/database");
const jwt=require('jsonwebtoken');
const app=express();
const cookieParser=require('cookie-parser');
const authRouter=require('./routes/auth')
const profileRouter=require('./routes/profile');
const requestRouter=require('./routes/request');
const userRouter=require('./routes/user');
const chatRouter=require('./routes/chat');

const cors=require('cors');
const paymentRouter = require("./routes/payment");
const http=require("http");

const initializeSocket=require("./utils/socket");



//handling cors error using cors middleware
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}));

console.log({
  authRouter,
  profileRouter,
  requestRouter,
  userRouter,
  paymentRouter,
  chatRouter
});
//middleware by xpress
app.use(express.json());
app.use(cookieParser());
require("./utils/cronJob");
app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);
app.use("/",userRouter);
app.use("/",paymentRouter);
app.use("/",chatRouter)

const server=http.createServer(app);

initializeSocket(server);


connectDB().then(()=>{
    console.log("Database connected successfully");
    server.listen(process.env.PORT,()=>{
    console.log("server running on port 4000")
})

}).catch((err)=>{
    // console.log(err);
    console.error("database can't be connected");
})

