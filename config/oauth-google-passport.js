const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");
const findOrCreate = require("mongoose-findorcreate");

// import User model for findOrCreate
const User = require("../models/User");

module.exports = (passport) => {
    passport.use(
        new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:3000/auth/google/dashboard"
      },
      function(accessToken, refreshToken, profile, cb) {
          console.log(profile);
        User.findOrCreate({ username: profile.emails[0].value, googleId: profile.id, name: profile.displayName }, function (err, user) {
          return cb(err, user);
        });
      }
    ));
}