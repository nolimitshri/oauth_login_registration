require("dotenv").config();
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");

const app = express();

// Passport Config
require("./config/passport")(passport);

// Passport Config for google oAuth
require("./config/oauth-google-passport")(passport);

// DB Config - mongoose connect
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true
}).then(() => console.log("MongoDB connected..."))
  .catch(e => console.log(e)) ;

// Middlewares
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Express session
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true
}));

// Passport Init
app.use(passport.initialize());
app.use(passport.session());

// EJS
app.use(expressLayouts);
app.set("view engine", "ejs");

// Connect flash
app.use(flash());

// Custom middlewares - Global vars
app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    res.locals.error = req.flash("error");
    next();
});

const PORT = 3000 || process.env.PORT;

// Routes
// app.use('/', require("./routes/index"));
app.use("/", require("./routes/users"));

app.listen(PORT, () => {
    console.log(`Server started at PORT: ${PORT}`);
});