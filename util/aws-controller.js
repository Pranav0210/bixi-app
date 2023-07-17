const aws = require('aws-sdk')
require('dotenv').config();

const imgUpload = async(blob)=>{
    const s3 = new aws.S3({
        accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
    })
    
    const uploadedImage = await s3.upload({
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: req.files[0].originalFilename,
        Body: blob,
      }).promise()

    return uploadedImage.Location;
}

module.exports = {imgUpload}