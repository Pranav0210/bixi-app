const crypto = require('crypto')
const OtpStore = require('../models/model.otpstore')

async function sendOtp(req, res) {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const client = require('twilio')(accountSid, authToken);

    const otp = await generateOTP()
    client.messages
        .create({
            body: `Your OTP for login to BIXI app is ${otp}`,
            from: process.env.TWILIO_MOBILE,
            to: req.body.user_msin                              //user mobile number
        })
        .then(message => console.log(message.sid))
        .then(()=>{
            const newOTP = new OtpStore(
            {
                msin : req.body.user_msin,
                prefix : `+91`,
                otp_val : otp
            })
            newOTP.save()
        })
        .then(res.status(201).send(`OTP request successfully created`))
        .catch((err)=>{
            console.log(err)
        });
}
/**
 * 
 * @param {Object} req 
 * @param {Object} res 
 */
async function verifyOtp(req,res) {
    try{
        const query = await OtpStore.findOne({
            msin : req.body.user_msin,
        }).exec()
        console.log(query)
            if(query!=null && query.otp_val == req.body.otp){
                await OtpStore.deleteOne({msin : req.body.user_msin,}).exec()
                return true;
            }
            else 
                return false
    }
    catch{
        (err)=>{
        console.log(`Verification failed : ${err}`)
        res.status(501).end(`Internal server error`)
    }}
}
function generateOTP(){
    const num = crypto.randomInt(1000,10000)
    const verificationCode = num.toString().padStart(4,"0")
    return verificationCode;
}
module.exports = { sendOtp, verifyOtp }