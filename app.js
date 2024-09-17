require('dotenv').config();

const express = require('express');
const ejs = require('ejs');
const mongoose = require('mongoose');

const bcrypt = require('bcrypt');
const saltRounds = 10;

const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set("views", __dirname + "/views");

mongoose.connect('mongodb://127.0.0.1:27017/userDB');

const userSchema = new mongoose.Schema ({
    email: {type: String},
    password: {type: String},
});

const User = mongoose.model('User', userSchema);

/************************************* Requests Targetting Home Route *********************************************/

app.route('/')

    .get((req, res) => {
        res.render('home');
    });

/************************************* Requests Targetting Login route *********************************************/

app.route('/login')

    .get((req, res) => {
        res.render('login');
    })

    // User Authentication
    .post((req, res) => {
        
        const username = req.body.username;
        const password = req.body.password;

        User.findOne({email: username}) // returns a single object or null

            .then((foundUser) => {
                    
                    if (foundUser) {    // foundUser is not null: User exists in db
                                                
                        // bcrypt.compare(myPlaintextPassword, hash).then(function(result) { result = true });

                        bcrypt.compare(password, foundUser.password).then(function(result) {
                            
                            if (result) {
                                res.render('secrets');   
                            } 
                            
                            else {
                                res.render('login', {message: 'Password did not match!'});
                            }
                        });
                    }

                    else {  // foundUser is null: User does not exist in db
                        res.render('login', {message: 'User not found!'});
                    }
                })
                
                .catch((err) => {                
                    console.error(err);
                    res.render('login', {message: 'An error occurred. Please try again.'});
                })
    });

/************************************* Requests Targetting Register route *********************************************/

app.route('/register')

    .get((req, res) => {
        res.render('register');
    })

    // Creates a new user
    .post((req, res) => {

        username = req.body.username;
        User.findOne({email: username})    // Check if user is already registered or not

            .then((foundUser) => {
                
                if (foundUser) {    // User already registered. No need to register again.
                    return res.render('register', {message: 'User already exists!'});
                } 
                
                else {  // User is not registered. So, register it.
                    
                    // Salting & hashing the password using bcrypt before saving
                    
                    bcrypt.hash(req.body.password, saltRounds).then(function(hash) {
                        
                        const newUser = new User({
                            email: req.body.username,
                            password: hash,
                        });
                
                        newUser.save()
                
                            .then(() => {
                                res.render('secrets');
                            })
                            
                            .catch((err) => {
                                console.error(err);
                                res.send("An error occurred during registration.");
                            });
                    });
                }
            })

            .catch((err) => {
                console.error(err);
                res.render('register', {message: 'An error occurred. Please try again.'});
            })

        
    });


/************************************* Requests Targetting Submit route *********************************************/

app.route('/submit')

    .get((req, res) => {
        res.render('submit');
        
    });

/************************************* Requests Targetting Logout route *********************************************/

app.route('/logout')

    .get((req, res) => {
        res.render('home');
    });



app.listen(port, ()=>{
    console.log("Server started on port 3000.");
});