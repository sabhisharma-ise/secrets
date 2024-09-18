require('dotenv').config();

const express = require('express');
const ejs = require('ejs');
const mongoose = require('mongoose');

const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set("views", __dirname + "/views");

// configure session parameters
app.use(session({
    secret: 'hello world',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize()); // Initialize passport.js
app.use(passport.session());    // Use passport.js for all sessions

mongoose.connect('mongodb://127.0.0.1:27017/userDB');

const userSchema = new mongoose.Schema ({
    email: {type: String},
    password: {type: String},
});

userSchema.plugin(passportLocalMongoose);   // add passport-local-mongoose plugin to user schema

const User = mongoose.model('User', userSchema);

passport.use(User.createStrategy());    // create a local strategy for passport

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.get('/', (req, res) => {
    res.render('home');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', passport.authenticate('local', {
    successRedirect: '/secrets',
    failureRedirect: '/login'
}));

app.get('/register', (req, res) => {
    res.render('register');
});

app.post('/register', (req, res) => {
    
    User.register({username: req.body.username}, req.body.password)

    .then((user) => {
        passport.authenticate('local')(req, res, () => {
            res.redirect('/secrets')
        });
    })
    
    .catch((err) => {
        console.error(err);
        res.render('register', {message: 'An error occurred. Please try again.'});
    })
});

app.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {console.log(err);}
        res.redirect('/');
    });
});

app.get('/secrets', (req, res) => {
    
    if (req.isAuthenticated()) {
        res.render('secrets');
    } else {
        res.redirect('/login');
    }
});

app.listen(port, ()=>{
    console.log("Server started on port 3000.");
});