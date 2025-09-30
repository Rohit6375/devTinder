console.log("starting a new project");
const express=require('express');
const app=express();
const port=3000;

// will match only GET HTTP method api call to /user
app.get('/user',(req,res)=>{
    res.send({first_name:"Rohit",last_name:"Morya"});
})

app.post('/user',(req,res)=>{
    //save data to db
    res.send("data saved in db succesfully")
})
app.delete('/user',(req,res)=>{
    //delete user from
    res.send("user deleted successfully");
})

// will match all HTTP method api call to /test
app.use("/test",(req,res)=>{
    res.send("Hello from the Server")
})


app.listen(port,()=>{
    console.log('example app listening on port',port);
})
