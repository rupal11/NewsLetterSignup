const express=require("express");
const bodyParser=require("body-parser");
const request=express("request");
const https=require("https");
require('dotenv').config();

const app=express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

// This project uses mail-chimp server and bootstrap standard login page 


app.get("/",function(req,res){
    res.sendFile(__dirname + "/signup.html")
})

app.post("/",function(req,res){
    const firstName=req.body.fName;
    const lastName=req.body.lName;
    const email=req.body.email;

    const data = {
        members:[
            {
                email_address : email,
                status:"subscribed",
                merge_fields: {
                    FNAME:firstName,
                    LNAME:lastName
                }
            }
        ]
    };

                                                                                  

    const jsonData=JSON.stringify(data);

    const list_id=process.env.LIST_ID;                      //List_Id              //  List_id,Api_key,user name are hidden 
    const api_key=process.env.API_KEY;                      //API_Key              // You have to create a .env file with these values or replace "process.env.xyz"
    const user=process.env.USER;                            //User Name            // with your credentials respectively.
    const authorization= user + ":"+ api_key;
  

    const url = "https://us1.api.mailchimp.com/3.0/lists/" + list_id;

    const options={
        method : "POST",
        auth : authorization
    }

    const request = https.request(url,options,function(response){

        if(response.statusCode === 200)
            res.sendFile(__dirname + "/success.html");
        else
            res.sendFile(__dirname + "/failure.html");

        response.on("data",function(data){
        console.log(JSON.parse(data));
        })
    })

    request.write(jsonData);
    request.end();
});


app.post("/failure",function(req,res){
    res.redirect("/");
})


app.listen(process.env.PORT || 3000,function(){
    console.log("Server is running on port 3000.")
});

