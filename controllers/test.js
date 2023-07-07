const crypto = require('crypto')
function generateOTP(){
    const num = crypto.randomInt(0,10000)
    console.log(num)
    const verificationCode = num.toString().padStart(4,"0")
    console.log(verificationCode)
}
generateOTP();