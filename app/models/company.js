var mongoose 		= require('mongoose'),
    autoIncrement   = require('mongoose-auto-increment');

var companySchema = mongoose.Schema({
    name                : String,
    email               : String,
    streetAddress       : String,
    cityAddress 		: String,
    stateAddress		: String,
    phoneNumber         : String,
    updated             : { type: Date, default: Date.now },
    users : { type: Number, ref: 'User' }
});

// autoIncrement the primary key
companySchema.plugin(autoIncrement.plugin, 'Company');

// methods ======================
module.exports = mongoose.model('Company', companySchema);