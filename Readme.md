//
// will match only GET HTTP method api call to /user
// app.get('/user',(req,res)=>{
//     res.send({first_name:"Rohit",last_name:"Morya"});
// })

// app.post('/user',(req,res)=>{
//     //save data to db
//     res.send("data saved in db succesfully")
// })
// app.delete('/user',(req,res)=>{
//     //delete user from
//     res.send("user deleted successfully");
// })

// // handles request for /abc and also for ac (b is optional)
// app.get("/ab?c",(req,res)=>{
//     res.send({firstname:"Bulbul",lastname:"Soni"});
// })

// app.get("/ab+c",(req,res)=>{
//     res.send("hello from ab+C");
// })
// will match all HTTP method api call to /test
app.get("/user/:userId",(req,res)=>{
    // console.log(req.query);
    console.log(req.params);
    res.send("Hello from the Server")
})
