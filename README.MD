# What is this project?

**I built this project because I wanted to practice using the Nodemailer module in node.js as well as Google OAuth2.**

This application is meant to mimic a newsletter sign-up process. The user is asked for their name, email, and what topics they would like to "receive" in the newsletter. Upon receiving the user's details the application redirects to a success page, adds users details to a database and sends a confirmation email to the provided address. The user will only receive one email (the confirmation) and will not actually be 'signed-up' to receive any further emails.

---
You can view a live version of the application [here]().
---

## How to run this project locally?

### Project Setup
1. Ensure that you have NPM and Node.js installed on your machine.
2. Make sure that you have MongoDB installed and properly configured on your machine. These instructions do not cover how to run the project with a DB that is being run on an external server, minimal changes to the code are required for this to work.
3. In your project directory run `npm install` to install all the required dependencies.
4. Once dependencies are installed head to the app.js file and locate the `mongoose.connect()` function. By default the name of the database is nodeMailerDB but you may change it to whatever you like at the end of the string.
5. Start up MongoDB with the `mongod` command followed by any flags if your local configuration requires it.
6. Start the application with `node app.js` and head to `localhost:3000` in your browser of choice.

### Google OAuth Setup
The nodemailer settings in this project use Google's OAuth2 and read these values from environment variables.

These variables are `CLIENT_ID` `CLIENT_SECRET` `REDIRECT_URI` `REFRESH_TOKEN` & `EMAIL`.

If you use Google OAuth2: 
- REDIRECT_URI will be https://developers.google.com/oauthplayground
- EMAIL will be the google account you are using.

You will need to obtain your own: 
- Client ID
- Client Secret Key
- Refresh Token

Make sure to populate these values into the respective environment variables or create your own otherwise mail will not send.