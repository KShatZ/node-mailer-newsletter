const express = require("express");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");

// Application Configuration
const app = express();
app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));
app.set("view-engine", "ejs");

// Database Configuration
mongoose.connect("mongodb://localhost:27017/nodeMailerDB");


// ROUTING
app.get("/", function(req, res){
    res.send("Working");
});

app.listen("3000", function(){
    console.log("Server listening on port 3000");
});