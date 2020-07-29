
require('dotenv').config();
//Environment variables: Necessary to put it at the top, otherwise if you try to use an environment variable, and
//it's not configured then you won't be able to access it.
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect("mongodb://localhost:27017/usersDB", {useNewUrlParser: true, useUnifiedTopology: true});

const userSchema = new mongoose.Schema({
  email: String,
  password:String
});

userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ['password']});
/* Make sure to pass the encrypted schema before creating the model.
  This encryption module will encrypt the password when the data.save() and will decrypt when the find() method is called.*/
const User = new mongoose.model("User", userSchema);

app.get("/", function(req, res){
  res.render("home");
});

app.get("/login", function(req, res){
  res.render("login");
});

app.get("/register", function(req, res){
  res.render("register");
});

app.post("/register", function(req, res){

  const newUser = new User({
    email: req.body.username,
    password: req.body.password
  });

  newUser.save(function(err){
    if(!err){
      res.render("secrets");
    }
  });
});

app.post("/login", function(req, res){

  const oldUserName = req.body.username;
  const oldUserPassword = req.body.password;

  User.findOne({email: oldUserName}, function(err, checkUser){
    if(!err){
      if(checkUser){
        if(checkUser.password === oldUserPassword){
          res.render("secrets");
        }
      }
    }
  });
});

app.listen(3000);
