// const { verifyOtp } = require("../controllers/otp");

async function authorize(req,res,next){
    console.log(`session change : ${req.session.isChanged}`)
    if(req.session.isChanged){
        res.status(401).send('Unauthorized!')
    }
    else{
        //VALIDATE REQUEST FOR ACCESS OF RESOURCE
        console.log(req.session)
        // console.log(req.session.isNew)
        // console.log(req.session.isPopulated)
        next();
    }
};
module.exports = authorize;