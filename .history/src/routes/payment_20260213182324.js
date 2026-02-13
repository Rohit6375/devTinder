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

paymentRouter.post("/payment/webhook", async (req,res)=>{
 try {

  console.log("webhook called");

  const webhookSignature = req.get("X-Razorpay-Signature");

  const isWebhookValid = validateWebhookSignature(
     JSON.stringify(req.body),
     webhookSignature,
     process.env.RAZORPAY_WEBHOOK_SECRET
  );

  if(!isWebhookValid){
    return res.status(400).send("Invalid signature");
  }

  const paymentDetails = req.body.payload.payment.entity;

  const payment = await Payment.findOne({orderId: paymentDetails.order_id});
  if(!payment) return res.status(404).send("payment not found");

  payment.status = paymentDetails.status;
  await payment.save();
  console.log("payment saved");

  const user = await User.findById(payment.userId);
  if(!user) return res.status(404).send("user not found");

  user.isPremium = true;
  user.membershipType = payment.notes.membershipType;
  await user.save();
  console.log("user saved");

  return res.status(200).send("ok");

 } catch(err){
   console.error(err);
   return res.status(500).send(err.message);
 }
});

paymentRouter.get("/premium/verify",userAuth,async(req,res)=>{
  try {
    const user=req.user;
    if(user.isPremium){
      return res.json({isPremium:true});
    }
    return res.json({isPremium:false});
  } catch (error) {
    res.status(500).send(error.message);
  }
})



module.exports=paymentRouter;