// app/models/user.js

// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var userSchema = mongoose.Schema({

    local            : {
        email           : String,
        password        : String,
        salt            : String
    },
    facebook         : {
        id              : String,
        token           : String,
        email           : String,
        name            : String
    },
    twitter          : {
        id              : String,
        token           : String,
        displayName     : String,
        username        : String
    },
    google           : {
        id              : String,
        token           : String,
        email           : String,
        name            : String
    },
    info            : {
        firstName       : String,
        lastName        : String,
        mobileNo        : String,
        streetAddress   : String,
        cityAddress     : String,
        stateAddress    : String        
    },
    admin            : {
        isAdmin         : Boolean
    }

// use a form, jquery post
// admin can select 1 user and update the data just like the user can update his own data
// add a review;; user can add a review to a business
});

// methods ======================
// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);
