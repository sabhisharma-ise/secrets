require('dotenv').config();
const express = require('express');
const ejs = require('ejs');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');

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

userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ['password']}); // https://www.npmjs.com/package/mongoose-encryption#secret-string-instead-of-two-keys
                                                                            // https://www.npmjs.com/package/mongoose-encryption#encrypt-only-certain-fields
const User = mongoose.model('User', userSchema);

// That's it! Don't need to do anything else in /login or /register route to encrypt
// Because, the way that mongoose-encryption works is that it will encrypt 
// when you call 'save' i.e., creating a new user. And, it will decrypt 
// when you call 'find' i.e., finding out a document based on email provided


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
                    // foundUser is not null: User exists in db
                    if (foundUser) {
                        if (foundUser.password === password) {
                            res.render('secrets');   
                        } else {
                            res.render('login', {message: 'Password did not match!'});
                        }
                    }
                    // foundUser is null: User does not exist in db
                    else {
                        res.render('login', {message: 'User not found!'});
                    }
                })
                
                .catch((err) => {                
                    console.error(err);
                    res.render('login', {message: 'An error occurred. Please try again.'});
                    // res.send(err);
                })
    });

/************************************* Requests Targetting Register route *********************************************/

app.route('/register')

    .get((req, res) => {
        res.render('register');
    })

    // Create one new user
    .post((req, res) => {

        // Check if user is already registered or not
        username = req.body.username;
        User.findOne({email: username})

            .then((foundUser) => {
                // User already registered. No need to register again.
                if (foundUser) {
                    return res.render('register', {message: 'User already exists!'});
                } 
                // User is not registered. So, register it.
                else {
                    const newUser = new User({
                        email: req.body.username,
                        password: req.body.password,
                    });
            
                    newUser.save()
            
                        .then(() => {
                            res.render('secrets');
                        })
                        
                        .catch((err) => {
                            console.error(err);
                            res.send("An error occurred during registration.");
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
        console.log(req.user);
        
    });

/************************************* Requests Targetting Logout route *********************************************/

app.route('/logout')

    .get((req, res) => {
        res.render('home');
    });



app.listen(port, ()=>{
    console.log("Server started on port 3000.");
});