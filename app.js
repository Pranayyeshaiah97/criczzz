const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const ejs = require("ejs")
const mongoose =require("mongoose");

const app = express();
const players = [];

app.set('view engine', 'ejs')
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

//connnecting mongoose to the local server
mongoose.connect("mongodb://localhost:27017/CriczzzDB", {useNewUrlParser: true, useUnifiedTopology: true})



//Creating Schema
const signupSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  emailID: String,
  password: String,
  rePassword: String,
  dob: String,
  gender: String
});
//Creating Member model
const Member = mongoose.model("Member", signupSchema);
app.post("/", function(req,res){
const members = new Member({
  firstName:  req.body.fName,
  lastName: req.body.lName,
  emailID: req.body.eMail,
  password: req.body.pass,
  rePassword: req.body.rePass,
  dob: req.body.dateOfBirth,
  gender: req.body.sex
});
members.save(function(err){
  if(err){
    console.log(err);
  }else{
    console.log("successfully Inserted");
  }
  res.redirect("/")
});
});



const loggedInSchema = new mongoose.Schema({
  emailID: String,
  password: String
});
const LoggedInMember = mongoose.model("LoggedInMember", loggedInSchema);


// app.post("/signIn", function(req,res){
//   const searchObject = {
//     emailID: req.body.signInUserName,
//     password: req.body.signInPassword
//   }
//   const results = Member.find(searchObject);
//   console.log(results);
// });


app.post("/signIn", function(req,res){
  Member.find(function(err, members){

    if(err){
      console.log(err);
    }else{

      members.forEach(function(members){
        const emailId = members.emailID;
        const password = members.rePassword;

          while(emailId === req.body.signInUserName || password === req.body.signInPassword){
            // console.log("successfully logged in");
            const loggedInMembers = new LoggedInMember ({
               emailID: req.body.signInUserName,
               password: req.body.signInPassword
             });
            loggedInMembers.save(function(err){
              if(err){
                console.log(err);
              }else{
                res.render("homepage");
              }
              });
            break;
        };
        while(emailId !== req.body.signInUserName || password !== req.body.signInPassword){
          res.send('<script>alert("Username or password is incorrect")</script>');
          res.render("index");
          break;
        };
    });
  };
  });
});







// Directing to index page
app.get("/", function(req, res){
  res.render("index");
});


// Directing to homepage
app.get("/homepage", function(req, res){
  res.render("homepage");
})

app.get("/addTeam", function(req,res){
  res.render("addTeam", {newPlayer: players});
});

app.post("/addTeam", function(req,res){
  const player = req.body.player;
  players.push(player);
  res.redirect("/addTeam");

});

app.listen(process.env.PORT || 3000, function(){
  console.log("You are now live");
});
