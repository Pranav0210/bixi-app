const multer = require("multer");
const multerS3 = require("multer-s3-transform");
const AWS =require("aws-sdk");
const S3 = new AWS.S3({
    accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
});


const uploadImg = multer({
   storage: multerS3({
      s3:S3,
      bucket: process.env.AWS_S3_BUCKET_NAME,
      acl: 'public-read',
      key: function(req, file, cb){
        const {name} = req.body
        if(file.fieldname == "aadharfile"){
            cb(null,name+"/" + file.fieldname+'.jpg');
        }
        else if(file.fieldname == "dlfile"){
            cb(null,name+"/" + file.fieldname+'.jpg');
        }
        else if(file.fieldname == "profilefile"){
            cb(null,name+"/" + file.fieldname+'.jpg');
        }
      }
   })
     
});


module.exports = uploadImg.fields([
{
    name:'aadharfile', maxCount: 1
},
{
    name:'dlfile', maxCount: 1
},
{
    name:'profilefile', maxCount: 1
},
]);