const crypto = require('crypto')
const OtpStore = require('../models/model.otpstore')
const Admin = require('../models/model.admin')
const User = require('../models/model.user')

async function sendOtp(req, res) {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const client = require('twilio')(accountSid, authToken);

    var now = new Date();
    var exists = await OtpStore.findOne({
        msin : req.body.user_msin,
        prefix : `+91`
    }).exec()
    console.log(exists)
    if(exists && exists.expiry>now){
        res.status(409).send(`OTP request denied...`)
    }
    else{

        const otp = await generateOTP()
        client.messages
            .create({
                body: `Your OTP for login to BIXI app is ${otp}`,
                from: process.env.TWILIO_MOBILE,
                to: req.body.user_msin                              //user mobile number
            })
            .then(message => console.log(message.sid))
            .then(async()=>{
                
                var exp = new Date();
                exp.setSeconds(exp.getSeconds()+120)
                
                if(exists && exists.expiry<now){
                    exists.otp_val = otp;
                    exists.expiry = exp;
                    
                    await exists.save();
                }
                else if(!exists){
                    const newOTP = new OtpStore(
                        {
                            msin : req.body.user_msin,
                            prefix : `+91`,
                            otp_val : otp,
                            expiry: exp
                        })
                    await newOTP.save()
                }
            })
            .then(res.status(201).send(`OTP request successfully created`))
            .catch((err)=>{
                console.log(err)
            });
    }

}
/**
 * 
 * @param {Object} req 
 * @param {Object} res 
 */
async function verifyOtp(req,res) {
    try{
        if(req.body.authLevelRequested == 'admin'){
            const admin = await Admin.findOne({
                contact:Number(req.body.user_msin.toString().slice(2))
            }).exec()
            console.log(admin)
            if(admin){
                const query = await OtpStore.findOne({
                    msin : req.body.user_msin,
                }).exec()
                console.log(query)
                    if(query!=null && query.otp_val == req.body.otp && query.expiry>new Date()){
                        await OtpStore.deleteOne({msin : req.body.user_msin,}).exec()
                        req.session.type = 'Admin';
                        req.session.user_id = admin._id;
                        // return true;
                        res.status(200).send(`Admin Verified.`)
                    }
                    else{
                        res.status(401).send(`OTP verification failed. Try again`)
                        // return false
                    } 
            }
            else{
                res.status(403).send({
                    msg:`Admin profile doesn't exist`
                })
            }
        }
        else{
            const query = await OtpStore.findOne({
                msin : req.body.user_msin,
            }).exec()
            console.log(query)
                if(query!=null && query.otp_val == req.body.otp && query.expiry>new Date()){
                    await OtpStore.deleteOne({msin : req.body.user_msin,}).exec()
                    req.session.type = 'User';
                    const regdUser = await User.findOne({contact:Number(req.body.user_msin.toString().slice(2))}).exec()
                    if(regdUser)
                        req.session.user_id = regdUser._id;
                    else
                        req.session.user_id = null
                    // return true;
                    res.status(200).send(`User Verified.`)
                }
                else{
                    res.status(401).send(`OTP verification failed. Try again`)
                    // return false
                } 
        }

    }
    catch{
        (err)=>{
        console.log(`Verification failed : ${err}`)
        res.status(500).end(`Internal server error`)
    }}
}
function generateOTP(){
    const num = crypto.randomInt(1000,10000)
    const verificationCode = num.toString().padStart(4,"0")
    return verificationCode;
}
module.exports = { sendOtp, verifyOtp, generateOTP }