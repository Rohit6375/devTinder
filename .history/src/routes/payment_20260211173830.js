const express=require("express");

const paymentRouter=express.Router();
const userAuth=require("../middlewares/auth")
const razorpayInstance=require("../utils/razorpay");

paymentRouter.post("/payment/create",userAuth,async(req,res)=>{
  try {
 const order=await razorpayInstance.orders.create({
  amount: 50000,
  currency: "INR",
  receipt: "receipt#1",
  partial_payment: false,
  notes: {
    firstName: "value3",
    lastName: "value2",
    membershipType:"silver"
  }
});

//save order info in database 
console.log(order);

//return response to the frontend
res.json(order);

  } catch (error) {
    
  }
})


module.exports=paymentRouter;