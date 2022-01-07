const express = require("express");
const { route } = require(".");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");
const { ensureAuthenticated } = require("../config/auth");

// User models import
const User = require("../models/User");

// Home route
router.get("/", (req, res) => res.render("welcome"));

// Login page
router.get("/login", (req, res) => res.render("login"));

// Register page
router.get("/register", (req, res) => res.render("register"));

// Register handle
router.post("/register", (req, res) => {
    const { name, email, password, password2 } = req.body;
    let errors = [];
    // validation checks
    // check required fields
    if(!name || !email || !password || !password2){
        errors.push({ msg: "Please fill in all the fields!" });
    }

    // check passwords match
    if(password !== password2){
        errors.push({ msg: "The password do not match!!" });
    }

    // check passowrd length
    if(password.length < 6){
        errors.push({ msg: "Password must be at least 6 character long!" });
    }

    // if the errors array has atleast one or more errors then,
    if(errors.length > 0){
        res.render("register", {
            errors: errors,
            name,
            email,
            password,
            password2
        });
    } else {
        // validation passes
        // checks from data base if the user with the emailID exists in the DB
        User.findOne({
            email: email
        }).then(user => {
            // User exists
            if(user){
                errors.push({ msg: "Email is already registered" });
                res.render("register", {
                    errors: errors,
                    name,
                    email,
                    password,
                    password2
                });
            } else {
                // User not exist create new user
                const newUser = new User({
                    name,
                    email,
                    password
                });

                // hash password
                bcrypt.genSalt(10, (err, salt) => 
                    bcrypt.hash(password, salt, (err, hashedPassword) => {
                        if(err) throw err;
                        newUser.password = hashedPassword;
                        newUser.save()
                        .then(user => {
                            req.flash("success_msg", "You are now registered and can log in!");
                            res.redirect("/users/login");
                        }).catch(e => console.log(e));
                    }
                ))
                
            }
            
        })
    }

})


// Login Handle
router.post("/login", (req, res, next) => {
    passport.authenticate("local", {
        successRedirect: '/dashboard',
        failureRedirect: "/login",
        failureFlash: true
    })(req, res, next);
});


router.get("/dashboard", ensureAuthenticated,(req, res) => res.render("dashboard", {user: req.user}));

// google oAuth request hanfler
router.get('/auth/google',
  passport.authenticate('google', { scope: ["profile", "email"] }));

router.get("/auth/google/dashboard", 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/dashboard');
  });

// Logout handle
router.get("/logout", (req, res)=>{
    req.logout();
    req.flash("success_msg", "You have been logged out");
    res.redirect("/login");
})

module.exports = router;