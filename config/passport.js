const localStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// import User model
const User = require("../models/User");



module.exports = (passport) => {
    passport.use(
        new localStrategy({ usernameField: "email" }, (email, password, done) => {
            // match user by email in DB
            User.findOne({ email: email })
            .then(user => {
                if(!user){
                    return done(null, false, {msg: "That email is not registered"});
                } 
                // match the password
                bcrypt.compare(password, user.password, (err, isMatch) => {
                    if(err) throw err;
                    if(isMatch){
                        return done(null, user)
                    } else {
                        return done(null, false, {msg: "Password Incorrect!"})
                    }
                })

            }).catch(e => {console.log(e)})

        })
    )
    
    passport.serializeUser((user, done) => {
        done(null, user.id);
      });
      
      passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
          done(err, user);
        });
      });

}