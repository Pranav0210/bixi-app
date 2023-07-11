// const { verifyOtp } = require("../controllers/otp");

async function authorize(req,res,next){
    console.log(`session change : ${req.session.isChanged}`)
    if(req.session.isChanged){
        // const check = await verifyOtp(req,res);
        // if(check){
        //     // req.session.token = 'newToken'
        //     // res.status(200).send('Authorized')
        //     console.log('Authorized!')
        //     res.status(200);
        //     next();
        // }
        // else
        res.status(401).send('Unauthorized!')
    }
    else{
        console.log(req.session)
        // console.log(req.session.isNew)
        // console.log(req.session.isPopulated)
        next();
    }
};
module.exports = authorize;