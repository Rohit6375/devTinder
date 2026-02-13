const express=require("express");

const paymentRouter=express.Router();
const userAuth=require("../middlewares/auth")
const razorpayInstance=require("../utils/razorpay");

paymentRouter.post("/payment/create",userAuth,async(req,res)=>{
  try {
    razorpayInstance.orders.create({
  "amount": 50000,
  "currency": "INR",
  "receipt": "receipt#1",
  "partial_payment": false,
  "notes": {
    "key1": "value3",
    "key2": "value2"
  }
})
  } catch (error) {
    
  }
})


module.exports=paymentRouter;