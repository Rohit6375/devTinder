
const mongoose=require("mongoose");

const connectDB=async()=>{
    await mongoose.connect("mongodb+srv://moryarohit7976_db_user:HUN5IkwBPVffBVVg@namastenode.kdyba5r.mongodb.net/devTinder");
};
module.exports=connectDB;
