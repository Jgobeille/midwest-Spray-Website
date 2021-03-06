require('dotenv').config();


var express    = require("express");
var app        = express();
var bodyParser = require('body-parser');
var nodemailer = require('nodemailer');
var session    = require('express-session');
var flash = require('connect-flash');

//EJS view engine middleware
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());


//express-session middleware
app.use(session({
  secret: 'Bella',
  resave: true,
  saveUninitialized: true,
}));


//Express session Middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

//flash messages
app.use(flash());


app.get("/", function(req,res) {
    res.render("home");
});

app.get("/about", function(req, res){
    res.render("about");
});

app.get("/contact", function(req, res){
    res.render("contact");
});


//Actual email being sent
app.post('/send', function(req,res) {
    var output = `
    <p>You have a new contact request</p>
    <h3>Contact Details</h3>
    <ul>
        <li> Name: ${req.body.name}</li>
        <li> Email: ${req.body.email}</li>
        <li> Need: ${req.body.need}</li>
    </ul>
    <h3> Message:</h3>
    <p> ${req.body.message}</p>
`;


// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
    host: 'mail.cincytechblog.com',
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: "midwestspray@cincytechblog.com", // generated ethereal user
            pass: process.env.EMAIL_PASS // generated ethereal password
        },
        tls: {
            rejectUnauthorized: false
        }
});

    // setup email data with unicode symbols
    let mailOptions = {
        from: '"Nodemailer Contact" <midwestspray@cincytechblog.com>', // sender address
        to: 'midwestspray@cincytechblog.com', // list of receivers
        subject: 'New Request', // Subject line
        text: 'You have a new request', // plain text body
        html: output // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        // Preview only available when sending through an Ethereal account
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
req.flash('success', 'Thank you for your inquiry! We will contact you shortly!');        
res.redirect("contact");
    });
});

app.listen(process.env.PORT, process.env.IP, function(){
console.log("The app has started!");
});