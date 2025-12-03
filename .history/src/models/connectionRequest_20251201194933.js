const mongoose=require('mongoose');

const connectionRequestSchema=new mongoose.Schema({
    fromUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    toUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    status:{
        type:String,
        enum:{
            values:["interested","ignored","accepted","rejected"],
            message:`{VALUE}, is not a valid status`
        }
    }
});

connectionRequestSchema.pre("save",function(next){
   const connectionRequest=this;
        if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
            throw new Error("can't send request to yourself");
        }
        next();
})

// const ConnectionRequestModel= mongoose.model("ConnectionRequest",connectionRequestSchema);

module.exports=mongoose.model("ConnectionRequest",connectionRequestSchema);

