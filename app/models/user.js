// app/models/user.js

// load the things we need
var 
    mongoose        = require('mongoose'),
    bcrypt          = require('bcrypt-nodejs'),
    Schema          = mongoose.Schema,
    autoIncrement   = require('mongoose-auto-increment');

// configuration ===============================================================

// define the schema for our user model
var userSchema = new Schema ({

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

});

// autoIncrement the primary key
userSchema.plugin(autoIncrement.plugin, 'User');

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
