const express = require("express");
const { type } = require("express/lib/response");
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
                    console.log(firstName, lastName,"- Interested in edm");
                }else {
                    subscriber.interests.edm = false;
                    console.log(firstName, lastName,"- Not interested in edm");
                }
                if (selfDevNews){
                    subscriber.interests.selfDevelopment = true;
                    console.log(firstName, lastName,"- Interested in self development");
                }else {
                    subscriber.interests.selfDevelopment = false;
                    console.log(firstName, lastName,"- Not interested in self development");
                }
                if (seoNews){
                    subscriber.interests.seo = true;
                    console.log(firstName, lastName,"- Interested in seo");
                }else {
                    subscriber.interests.seo = false;
                    console.log(firstName, lastName,"- Not interested in seo");
                }
                if (cryptoNews){
                    subscriber.interests.crypto = true;
                    console.log(firstName, lastName,"- Interested in crypto");
                }else {
                    subscriber.interests.crypto = false;
                    console.log(firstName, lastName,"- Not interested in crypto");
                }
                subscriber.save();

                // Sending Confirmation Email
                nodemailer.createTestAccount(function(err, account){

                    if (err){
                        console.log(err);
                        return (process.end(1));
                    } 
                    console.log("Account User:", account.user);
                    console.log("Account Pass:", account.pass);
                    console.log("Account Host:", account.smtp.host);
                    console.log("Account Port:", account.smtp.port);
                    console.log("Account Secure:", account.smtp.secure);

                    let transporter = nodemailer.createTransport({
                        host: account.smtp.host,
                        port: account.smtp.port,
                        secure: account.smtp.secure,
                        auth: {
                            user: account.user,
                            pass: account.pass
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
                        } else {
                            console.log(err);
                        }
                    });
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