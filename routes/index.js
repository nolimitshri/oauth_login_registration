const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../config/auth");
const passport = require("passport");

router.get("/", (req, res) => res.render("welcome"));

router.get("/dashboard", ensureAuthenticated,(req, res) => res.render("dashboard", {user: req.user}));

// google oAuth request hanfler
// router.get('/auth/google',
//   passport.authenticate('google', { scope: ["profile", "email"] }));

// router.get("/auth/google/dashboard", 
//   passport.authenticate('google', { failureRedirect: '/users/login' }),
//   function(req, res) {
//     // Successful authentication, redirect home.
//     res.redirect('/dashboard');
//   });



module.exports = router;