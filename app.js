const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const ejs = require("ejs")
 
const app = express();

app.set('view engine', 'ejs')
 
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
 
// Directing to index page
app.get("/", function(req, res){
  res.render("index");
});

app.get("/homepage/addTeam", function(req,res){
  res.render("addTeam");
});

// Directing to homepage
app.get("/homepage", function(req, res){
  res.render("homepage");
})


app.listen(process.env.PORT || 3000, function(){
  console.log("You are now live");
});
