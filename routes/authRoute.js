const router = require('express').Router();
const Developer = require('../model/Developer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto')
const nodemailer = require('nodemailer')
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const resetPasswordTemplate = require('../mail-templates/reset-password')
const welcomeTemplate = require('../mail-templates/welcome')

//managing environment variables
const dotenv = require('dotenv');
dotenv.config();

const oauth2Client = new OAuth2(
    process.env.CLIENT_ID, // ClientID
    process.env.CLIENT_SECRET, // Client Secret
    "https://developers.google.com/oauthplayground" // Redirect URL
);

oauth2Client.setCredentials({
    refresh_token: process.env.REFRESH_TOKEN
});
const accessToken = oauth2Client.getAccessToken()

//Setting up SMTP transporter
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        type: "OAuth2",
        user: process.env.EMAIL,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
        accessToken: accessToken
    }
})

//Verifying SMTP connection
transporter.verify(function (error, success) {
    if (error) {
        console.log("Error verify SMTP Connection", error);
    } else {
        console.log("Server is ready to take our messages");
    }
});

//-----------------------API'S-------------------------------

//Register a new Developer
router.post('/register', async (req, res) => {

    //Checks email exists in db or not
    const emailExists = await Developer.findOne({
        email: req.body.email
    });
    if (emailExists) return res.status(400).json({
        message: 'Email Already Exists'
    });

    //hashing password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    //creating new developer
    const developer = new Developer({
        full_name: req.body.full_name,
        email: req.body.email,
        password: hashedPassword,
        group: req.body.group
    });
    try {
        //store data
        const developerSave = await developer.save();
        res.send({
            developer: developer._id
        });

        //sending welcome mail
        transporter.sendMail({
            from: `Admin from DCX <${process.env.EMAIL}>`,
            to: `${developerSave.email}`,
            subject: 'Welcome to DCX Community',
            html: welcomeTemplate(developerSave.full_name)
        }, (err, info) => {
            if (err) {
                return res.status(400).json({
                    message: "Error sending mail"
                });
            }
        })

    } catch (error) {
        res.status(400).send(error)
    }
});

//gets developer data as per pagination offset
router.get('/register/:offset', async (req, res) => {
    const offset = parseInt(req.params.offset);
    const data = await Developer.find().skip(offset).limit(5);
    const count = await Developer.countDocuments();
    if (!data) return res.status(400).json({
        message: "error"
    });
    if (data) return res.status(200).json({
        result: data,
        no: count
    });

});

//Getting all the developers
router.get('/', (req, res) => {
    Developer.find((err, docs) => {
        if (!err) {
            res.send(docs);
        } else {
            console.log('Error in Retrieving Developers :' + JSON.stringify(err, undefined, 2));
        }
    });
});

//Login
router.post('/login', async (req, res) => {
    console.log(req.body);

    //checks developer exists or not
    const developer = await Developer.findOne({
        email: req.body.email
    });
    if (!developer) return res.status(400).json({
        message: 'Invalid Credentials'
    });

    //checking password
    const validPassword = await bcrypt.compare(req.body.password, developer.password);
    if (!validPassword) return res.status(400).json({
        message: 'Invalid Credentials'
    });

    //token associated with developer id gets generated
    const token = await jwt.sign({
        _id: developer._id
    }, process.env.TOKEN_SECRET, {
        expiresIn: '24h'
    });
    if (token) return res.status(200).json(token);
    console.log('Logged in')


})

//For sending reset password link
router.post('/send-reset-link', (req, res) => {

    //Generating random token
    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            console.log(err)
        }
        const token = buffer.toString("hex")
        console.log("Reset Token", token)

        //Checks email exists in db or not
        Developer.findOne({
            email: req.body.email
        })
            .then((user) => {
                if (!user) {
                    return res.status(422).json({
                        message: "No user found with that email"
                    });
                }
                user.reset.resetToken = token
                user.reset.tokenExpiry = Date.now() + 3600000
                user.save().then((result) => {
                    transporter.sendMail({
                        from: `Admin from DCX <${process.env.EMAIL}>`,
                        to: `${user.email}`,
                        subject: 'Password reset link',
                        html: resetPasswordTemplate(token)
                    }, (err, info) => {
                        if (err) {
                            return res.status(400).json({
                                message: "Error sending mail"
                            });
                        }
                    })
                    return res.status(200).json({
                        message: "Reset link sent on your mail"
                    });
                }).catch((err) => {
                    console.log(err)
                })
            });
    })

    //return res.status(statusCode).send(message);
})

//For resetting password
router.post('/new-password', (req, res) => {
    const newPassword = req.body.password
    const sentToken = req.body.token

    console.log("TOKEN RECEIVED", sentToken)

    Developer.findOne({ 'reset.resetToken': sentToken, 'reset.tokenExpiry': { $gt: Date.now() } })
        .then((user) => {
            if (!user) {
                return res.status(422).json({
                    message: "Token expired, Please request new link"
                });
            }
            if (user.reset.tokenExpiry) {

            }
            //hashing password
            bcrypt.genSalt(10).then((salt) => {
                bcrypt.hash(req.body.password, salt)
                    .then((hashedPassword) => {
                        user.password = hashedPassword
                        user.reset.resetToken = undefined
                        user.reset.tokenExpiry = undefined
                        user.save().then((result) => {
                            return res.status(200).json({
                                message: "Password updated successfully"
                            });
                        })//user save
                    })//bcrypt hash
            })//bcrypt salt

        })//find user by token
        .catch((err) => {
            console.log(err)
        })
})

module.exports = router;