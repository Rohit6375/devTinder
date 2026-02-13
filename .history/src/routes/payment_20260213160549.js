const express=require("express");

const paymentRouter=express.Router();
const {userAuth}=require("../middlewares/auth")
const razorpayInstance=require("../utils/razorpay");
const Payment=require('../models/payment');
const {membershipAmout}=require("../utils/constant");
const {validateWebhookSignature} = require('razorpay/dist/utils/razorpay-utils')
const User=require('../models/user');

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
res.json({...savedPayment.toJSON(),keyId:process.env.RAZORPAY_KEY_ID});

  } catch (error) {
    console.log(error);
  }
});

paymentRouter.post("/payment/webhook",async(req,res)=>{
    try {
        const webhookSignature=req.headers[X-Razorpay-Signature];
        const isWebhookValid=validateWebhookSignature(JSON.stringify(req.body), webhookSignature, process.env.RAZORPAY_WEBHOOK_SECRET);
        if(!isWebhookValid){
            return res.status(400).json({msg:"webhook signature is invalid"});
        }
        //update payment status in DB
        const paymentDetails=req.body.payload.payment.entity;
        const payment= await Payment.findOne({orderId:paymentDetails.order_id});
        payment.status=paymentDetails.status;
        await payment.save();
    
        //update user to premium (make change in user model)
        const user =await User.findOne({_id:payment.userId});
        user.isPremium=true;
        user.memebershipType=payment.notes.membershipType;
        await user.save();

        // return response to webhook
        return res.status(200).json({msg:"webhook received successfully"});

    } catch (error) {
        return res.status(500).json({msg:error.message});
    }
})


module.exports=paymentRouter;