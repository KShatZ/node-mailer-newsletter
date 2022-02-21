require('dotenv').config();
const express = require("express");
const { google } = require("googleapis");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");

// Application Configuration
const app = express();
app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));
app.set("view engine", "ejs");

// Database Configuration
mongoose.connect("mongodb://localhost:27017/nodeMailerDB");

const subscriberSchema = new mongoose.Schema({
    firstName: {
        required: true,
        type: String
    },
    lastName: {
        required: true,
        type: String
    },
    email: {
        required: true,
        type: String,
    },
    interests: {
        required: true,
        type: {
            edm: Boolean,
            selfDevelopment: Boolean,
            seo: Boolean,
            crypto: Boolean
        }
    }
});
const Subscriber = mongoose.model("Subscriber", subscriberSchema);


// ROUTING
app.get("/", function(req, res){
    res.render("sign-up", {pageTitle: "Sign Up"});
});

app.post("/", function(req,res){
    // User Details
    const firstName = req.body.firstName,
    lastName = req.body.lastName,
    email = req.body.email;
    // User newsletter interests
    const topics = [];
    const edmNews = req.body.edmCheckbox, 
    selfDevNews = req.body.selfDevCheckbox,
    seoNews = req.body.seoCheckbox,
    cryptoNews = req.body.cryptoCheckbox;

    Subscriber.findOne({email: email}, function(err, result){

        if (!err){
            // User has not signed up
            if (!result){
                console.log("New subscriber: ", firstName, lastName);
                // Adding subscriber to DB
                let subscriber = new Subscriber({
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    interests: {}
                });
                if (edmNews){
                    subscriber.interests.edm = true;
                    topics.push("Electronic Dance Music");
                    console.log(firstName, lastName,"- Interested in edm");
                }else {
                    subscriber.interests.edm = false;
                    console.log(firstName, lastName,"- Not interested in edm");
                }
                if (selfDevNews){
                    subscriber.interests.selfDevelopment = true;
                    topics.push("Self Development");
                    console.log(firstName, lastName,"- Interested in self development");
                }else {
                    subscriber.interests.selfDevelopment = false;
                    console.log(firstName, lastName,"- Not interested in self development");
                }
                if (seoNews){
                    subscriber.interests.seo = true;
                    topics.push("Search Engine Optimization");
                    console.log(firstName, lastName,"- Interested in seo");
                }else {
                    subscriber.interests.seo = false;
                    console.log(firstName, lastName,"- Not interested in seo");
                }
                if (cryptoNews){
                    subscriber.interests.crypto = true;
                    topics.push("Crypto");
                    console.log(firstName, lastName,"- Interested in crypto");
                }else {
                    subscriber.interests.crypto = false;
                    console.log(firstName, lastName,"- Not interested in crypto");
                }
                subscriber.save();

                // Google OAuth2 - This might need to be done before the POST as it does take a while to redirect if succesful...
                const oauth2Client = new google.auth.OAuth2(
                    process.env.CLIENT_ID, 
                    process.env.CLIENT_SECRET, 
                    process.env.REDIRECT_URI
                );
                oauth2Client.setCredentials({refresh_token: process.env.REFRESH_TOKEN});
                const accessToken = oauth2Client.getAccessToken(function(err){
                    if(!err) {
                        console.log("Access Token:", accessToken);
                    } else {
                        console.log(err);
                    }
                });
                // Mail Set Up
                let transporter = nodemailer.createTransport({
                    host: "smtp.gmail.com",
                    port: 465,
                    secure: true,
                    auth: {
                        type: "OAUTH2",
                        user: process.env.EMAIL,
                        accessToken: accessToken,
                        clientId: process.env.CLIENT_ID,
                        refreshToken: process.env.REFRESH_TOKEN,
                        clientSecret: process.env.CLIENT_SECRET
                    }
                });
                let message = {
                    from: "Newsletter Test",
                    to: email,
                    subject: "Thank You to Subscribing to our Newsletter!",
                    html:
                    `<h1>Welcome to the family ${firstName} ${lastName}!</h1>
                    <p>
                    Thank you for signing up to our Newsletter! You will start to receive articles based 
                    on the interests you selected starting on the next rotation
                    </p>`
                }
                transporter.sendMail(message, function(err, info){
                    if (!err) {
                        console.log("The message was sent");
                        console.log("Message ID:", info.messageId);
                        console.log("Message Response:", info.response);
                        res.render("confirmation", {
                            pageTitle: "Newsletter Confirmation",
                            subscriberName: firstName,
                            email: email,
                            topics: topics
                        });
                    } else {
                        console.log(err);
                        // Alert user of failure and remove from DB
                        Subscriber.deleteOne({email: email}, function(err){
                            if (!err) {
                                console.log("There was an error sending the email...");
                                console.log("User was removed from database and no email was sent");
                                res.send("<script>alert('There was an issue with the email service, please try again...'); window.location.href = '/';</script>");
                            } else {
                                console.log(err);
                            }
                        });
                    }
                });
            } else { 
                console.log("You have already signed up for our newsletter.")
            }
        } else {
            console.log("There is an error")
            console.log(err);
        }
    });
});

app.listen("3000", function(){
    console.log("Server listening on port 3000");
});