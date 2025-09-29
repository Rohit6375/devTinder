console.log("starting a new project");
const express=require('express');
const app=express();
const port=3000;

// app.get('/',(req,res)=>{
//     res.send('hello world');
// });
app.use("/test",(req,res)=>{
    res.send("Hello from the Server")
})
app.use("/hello",(req,res)=>{
    res.send("Hello hello hello")
})
app.use('/',(req,res)=>{
    res.send("test code")
})

app.listen(port,()=>{
    console.log('example app listening on port',port);
})