require('dotenv').config();

const express = require('express');
const ejs = require('ejs');
const mongoose = require('mongoose');

const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const findOrCreate = require('mongoose-findorcreate');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public/"));
app.set('view engine', 'ejs');
app.set("views", __dirname + "/views");

// configure session parameters
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize()); // Initialize passport.js
app.use(passport.session());    // Use passport.js for all sessions

mongoose.connect(process.env.MONGO_URI);

const userSchema = new mongoose.Schema ({
    email: {type: String},
    password: {type: String},
    googleId: {type: String},
    secret: {type: String}
});

userSchema.plugin(passportLocalMongoose);   // add passport-local-mongoose plugin to user schema
userSchema.plugin(findOrCreate);

const User = mongoose.model('User', userSchema);

passport.use(User.createStrategy());    // create a local strategy for passport

passport.serializeUser(function(user, cb) {
    process.nextTick(function() {
      return cb(null, {
        id: user.id,
        username: user.username,
        picture: user.picture
      });
    });
});
  
passport.deserializeUser(function(user, cb) {
    process.nextTick(function() {
        return cb(null, user);
    });
});

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "https://secrets-xls4.onrender.com/auth/google/secrets"
  },
  function(accessToken, refreshToken, profile, cb) {
    console.log(profile);
    User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));

app.get('/', (req, res) => {
    res.render('home');
});

// Use passport to authenticate user using google strategy, & we require user's profile which includes email and userID of google
app.get('/auth/google', passport.authenticate('google', { 
    scope: ['profile'] 
}));

app.get('/auth/google/secrets', 
    passport.authenticate('google', { failureRedirect: '/login' }),
    function(req, res) {
      // Successful authentication, redirect to secrets.
      res.redirect('/secrets');
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
    User.find({'secret': {$ne: null}})
    .then((foundUser) => {
        if (foundUser) {
            res.render('secrets', {usersWithSecrets: foundUser});
        }
    }) 
    .catch((err) => {
        console.error(err);
    })
});

app.get('/submit', (req, res) => {
    if (req.isAuthenticated()) {
        res.render('submit');
    } else {
        res.redirect('/login');
    }
});

app.post('/submit', (req, res) => {
    
    const submittedSecret = req.body.secret;
    console.log(req.user.id);
    
    User.findById(req.user.id)
    
    .then((foundUser) => {
        console.log(foundUser);
        
        if (foundUser) {
            foundUser.secret = submittedSecret;
            foundUser.save()
            .then(() => {
                res.redirect('/secrets');
            });
        }
    })

    .catch((err) => {
        console.error(err);
    })

});

app.listen(port, ()=>{
    console.log("Server started on port 3000.");
});