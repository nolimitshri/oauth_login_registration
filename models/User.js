const mongoose = require("mongoose");
const findOrCreate = require("mongoose-findorcreate");

const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        // required: [true]
    },
    googleId: {
        type: String
    },
    email: {
        type: String,
        // required: [true]
    },
    password: {
        type: String,
        // required: [true]
    },
    date: {
        type: Date,
        default: Date.now()
    },
});

// userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

const User = mongoose.model("User", userSchema);

module.exports = User;