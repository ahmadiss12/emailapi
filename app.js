const express = require("express");
const bodyParser=require("body-parser");
const request = require ("request");
const https = require("https");
const app=express();
app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended:true}));
app.listen (process.env.PORT || 3000,function(){
    console.log("server is running");
})

app.get("/",function(req,res){
    res.sendFile(__dirname+"/signin.html");
})


app.post("/signin",function(req,res){
    var fname=req.body.fname;
    var lname=req.body.lname;
    var email=req.body.email;
    var data={
        members:[
            {
                email_address:email,
                status:"subscribed",
                merge_fields:{
                    FNAME:fname,
                    LNAME:lname
                }
            }
        ]
    };
    require('dotenv').config(); // Loads .env
mailchimp.setConfig({
  apiKey: process.env.MAILCHIMP_API_KEY, // Safely read from .env
  server: process.env.MAILCHIMP_SERVER_PREFIX,
});
    var jsonData=JSON.stringify(data);
    const url="https://us3.api.mailchimp.com/3.0/lists/c7f48a5049";
   const options = {
  method: "POST",
  auth: `user:${process.env.MAILCHIMP_API_KEY}`
};
    const request = https.request(url,options,function(response){
        if (response.statusCode===200){
            res.sendFile(__dirname+"/success.html");
           response.on("data",function(data){
            console.log(JSON.parse(data));
           });
        } else {
            res.sendFile(__dirname+"/failure.html");
            console.log("Error: " + response.statusCode);
        }
    });
    request.write(jsonData);
    request.end();
});

app.post("/failure",function(req,res){
    // Redirect to the signup page on failure
    res.redirect("/");      
})



//11aac60c7db6c9837ea07e9e52118756-us3
// c7f48a5049 
