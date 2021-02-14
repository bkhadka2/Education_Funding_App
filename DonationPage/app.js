const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const mongoose = require('mongoose');
const session = require('express-session');

const app = express();

// DB Config
const db = require('./config/database');

// Load Donation Model
require('./models/donation');
const Donation = mongoose.model('donationModel');

// Connecting to Mongoose
mongoose.connect(db.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('Database Connected'))
    .catch(err => console.log(err))

// Middleware for express handlebars
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// Middleware for images
app.use(express.static('images'));

// Express Session Middleware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

// Middleware for body parser
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Express Flash Middleware
app.use(flash());

// Glbal Variables
app.use(function (req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/about/campaign', (req, res) => {
    res.render('aboutCampaign');
});

app.get('/name', (req, res) => {
    Donation.find()
        .lean()
        .sort({ date: 'desc' })
        .then(donation => {
            res.render('name', {
                donation: donation
            });
        })
});

app.get('/about/me', (req, res) => {
    res.render('aboutMe');
});

app.post('/', (req, res) => {
    let errors = [];
    if (req.body.email1 != req.body.email2) {
        errors.push({ errorMessage: 'Emails did not match' })
    }
    if(req.body.email1 <= 0) {
        errors.push({ errorMessage: 'Enter email' })
    }
    if (req.body.firstName.length <= 0) {
        errors.push({ errorMessage: 'Enter first name' })
    }
    if (req.body.lastName.length <= 0) {
        errors.push({ errorMessage: 'Enter last name' })
    }
    if (errors.length > 0) {
        res.render('index', {
            errors: errors,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email1: req.body.email1,
            email2: req.body.email2
        })
    }
    else {
        Donation.findOne({
            email: req.body.email1
        })
            .then(user => {
                if (user) {
                    req.flash('error_msg', 'You have already registered this email');
                    res.redirect('/');
                }
                else {
                    // req.flash('success_msg', 'Thank you for your interest. We really appreciate your time');
                    const newUser = {
                        firstName: req.body.firstName,
                        lastName: req.body.lastName,
                        email: req.body.email1
                    }
                    new Donation(newUser)
                        .save()
                        .then(user => {
                            req.flash('success_msg', 'Thank you for your interest. We really appreciate your time');
                            res.redirect('/name');
                        })
                        .catch(err => {
                            console.log(err);
                            return;
                        })
                }
            })
    }

});

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
})