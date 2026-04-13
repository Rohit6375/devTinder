const socket=require("socket.io");
const  Chat  = require('../models/chat');

const initializeSocket=(server)=>{
const io=socket(server,{
    cors:{
        origin:"http://localhost:5173"
    }
});
io.on("connection",(socket)=>{
 // handle events
 socket.on("joinChat", ({firstName,userId,targetUserId})=>{
     const roomId=[userId,targetUserId].sort().join("_");
     
     console.log(firstName+" "+" joined room "+roomId);
     socket.join(roomId);
 });

 socket.on("sendMessage",async ({ senderId, receiverId, text, photoUrl }) => {
try {
     const roomId = [senderId, receiverId].sort().join("_");
// save messages to the database
  // two cases chat already exists or new chat

  let chat=await Chat.findOne({
    participants:{$all:[senderId,receiverId]}
  });

  if(!chat){
    chat=new Chat({
        participants:[senderId,receiverId],
        messages:[]
    })
  }

chat.messages.push({senderId,text});

await chat.save();


     io.to(roomId).emit("messageReceived", {
    senderId,
    text,
    photoUrl,
    createdAt: new Date()
  });
} catch (error) {
    console.log(error);
}
 
});


 socket.on("disconnect",()=>{

 });
})
}

module.exports=initializeSocket;