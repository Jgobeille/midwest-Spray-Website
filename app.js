require('dotenv').config();


var express    = require("express");
var app        = express();
var bodyParser = require('body-parser');
var nodemailer = require('nodemailer');


app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());


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
        
res.render("contact");
    });
});

app.listen(process.env.PORT, process.env.IP, function(){
console.log("The app has started!");
});