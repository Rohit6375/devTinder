const jwt=require('jsonwebtoken');
const User=require('../models/user')

const userAuth=async(req,res,next)=>{
   try {
    const cookies=req.cookies;
    const {token}=cookies;

    if(!token){
        throw new Error("token is not valid");
    }
    const decodedData=await jwt.verify(token,"Rohit@7727");
    const{_id}=decodedData;
    
    const user=await User.findById(_id);
    if(!user){
        throw new Error("user not found");
    }
    req.user=user;
    next();
   } catch (error) {
    res.status(400).send("ERROR : "+error.message);
   }
};

module.exports={userAuth};