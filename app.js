require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const ejs = require("ejs")
const mongoose =require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const findOrCreate = require("mongoose-findorcreate");

const app = express();
const players = [];

app.set('view engine', 'ejs')
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.use(session({
  secret: "This is my secret.",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

//connnecting mongoose to the local server
mongoose.connect("mongodb://localhost:27017/CriczzzDB", {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.set('useCreateIndex', true);



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

signupSchema.plugin(passportLocalMongoose);
signupSchema.plugin(findOrCreate);

//Creating Member model
const Member = mongoose.model("Member", signupSchema);

passport.use(Member.createStrategy());

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  Member.findById(id, function(err, user) {
    done(err, user);
  });
});

const loggedInSchema = new mongoose.Schema({
  emailID: String,
  password: String
});

const LoggedInMember = mongoose.model("LoggedInMember", loggedInSchema);


app.get("/addTeam", function(req,res){
  res.render("addTeam", {newPlayer: players});
});

// authenticating login form
app.get("/signup", function(req,res){
  if(req.isAuthenticated()){
    res.render("index");
  }else{
    res.render("index");
  }
});

// onclick of logout link, it ir redirecting to the homepage
app.get("/logout", function(req,res){
  req.logout();
  res.redirect("/");
});

// authenticating register form,
app.get("/homepage", function(req,res){
  if(req.isAuthenticated()){
    res.render("homepage")
  }else{
    console.log("successfully logged in");
  }
});

// pushing players into player array
app.post("/addTeam", function(req,res){
  const player = req.body.player;
  players.push(player);
  res.redirect("/addTeam");

});
// this code is taking all the inputs given by the user in register form and saving it
// the database. and hashing the password, after saving the data it is redirecting to the signup route
app.post("/signUpform", function(req,res){
  Member.register({
    firstName:  req.body.fName,
    lastName: req.body.lName,
    username: req.body.username,
    password: req.body.pass,
    rePassword: req.body.rePass,
    dob: req.body.dateOfBirth,
    gender: req.body.sex

  }, req.body.rePassword, function(err, user){
    if(err){
      console.log(err);
    }else{
      passport.authenticate("local")(req,res, function(){
        res.redirect("/signup")
      });
    }
  });
});

// This code is checking the given data by the user is matching the data in the Member collection.
// after authenticating it redirects to the homepage route.

app.post("/signIn", function(req,res){

const user = new Member({
  username: req.body.username,
  password: req.body.rePassword
});
req.login(user, function(err){
  if(err){
    console.log(err);
  }else{
    passport.authenticate("local")(req, res, function(){
      res.redirect("/homepage");
    });
  }
});
  });


// Server runing on localhost 3000
app.listen(process.env.PORT || 3000, function(){
  console.log("You are now live");
});
