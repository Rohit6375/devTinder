
const mongoose=require("mongoose");

const connectDB=async()=>{
    await mongoose.connect("mongodb+srv://moryarohit7976_db_user:vPO97AOEpJ5wNGq2@namastenode.kdyba5r.mongodb.net/devTinder");
};
module.exports=connectDB;
