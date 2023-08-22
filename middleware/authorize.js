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

async function adminAuth(req,res,next){
    try{
        if(req.session.type == 'admin'){
            next();
        }
        else{
            res.status(403).send(
                `Forbidden Route.`
            )
        }
    }
    catch(err){
        console.log(err);
        res.status(500).send('An Error Occured.')
    }
}
module.exports = {
    authorize,
    adminAuth
};