const express=require("express");

const paymentRouter=express.Router();
const {userAuth}=require("../middlewares/auth")
const razorpayInstance=require("../utils/razorpay");
const Payment=require('../models/payment');
const {membershipAmout}=require("../utils/constant");

paymentRouter.post("/payment/create",userAuth,async(req,res)=>{
  try {
    const {membershipType}=req.body;
    const{firstName,lastName,emailId}=req.user
 const order=await razorpayInstance.orders.create({
  amount: membershipAmout[membershipType]*100,
  currency: "INR",
  receipt: "receipt#1",
  partial_payment: false,
  notes: {
    firstName,
    lastName,
    emailId,
    membershipType:membershipType
  }
});

//save order info in database 
const payment=new Payment({
    userId:req.user._id,
    orderId:order.id,
    status:order.status,
    amount:order.amount,
    currency:order.currency,
    receipt:order.receipt,
    notes:order.notes
})
const savedPayment=await payment.save();

//return response to the frontend
res.json({...savedPayment.toJSON()});

  } catch (error) {
    console.log(error);
  }
})


module.exports=paymentRouter;