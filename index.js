const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
 
const app = express();
 
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
 
app.get("/", function(req, res){
  res.sendFile(__dirname + "/index.html");
});
 
app.post("/", function(req, res){
 
   // Make sure you recieve the the data from your form correctly by console l
   // logging the const values.
 
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.eMail;
 
 
 
   // This is crucial and make sure your keys match the ones in mail chimp
   // To make sure go to to audiece dashboard, then settings and Audience fiel                            
   // ds and *|MERGE|* tags.
 
  var data = {
    members:[ {
      EMAIL: email,
      status: "subscribed",
      merge_fields: {
        FNAME: firstName,  //if you change it in mailchimp change it here
        LNAME: lastName
      }
    }]
  };
 
  var jsondata = JSON.stringify(data);
 
  //Enter your list ID correcly else you will get errors like email cannot be                                          
  //blank.
   //replace us8 with your server eg us4 or us6
  const url = "https:///us18.api.mailchimp.com//3.0//lists//271198261d"; 
 
  const options = {
    method: "POST",
    body: data,
    auth: "19822146941a76e41a5c57995be79863-us18"
  }
 
  const request = https.request(url, options, function(response){

    if (response.statusCode === 200){
        res.send("successfully logged in");
    }
    else{
        res.send("There was an error");
    }

    response.on("data", function(data){
      console.log(JSON.parse(data));
    });
 
  });
 
  request.write(jsondata);
  request.end();
 
 
});
 
app.listen(process.env.PORT || 3000, function(){
  console.log("You are now live");
});

// API ID
// c5f21da90017d72959c82ca408b1b179-us18
// 19822146941a76e41a5c57995be79863-us18

// List ID
// 271198261d