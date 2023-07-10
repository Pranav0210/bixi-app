const mongoose = require('mongoose')

const OtpStore = new mongoose.Schema({
    msin : Number,
    prefix : String,
    otp_val : Number,
    expiry: Date
},
{timestamp:true});

const OTP = mongoose.model('Otp', OtpStore);
module.exports = OTP;