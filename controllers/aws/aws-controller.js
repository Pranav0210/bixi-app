const aws = require('aws-sdk')
require('dotenv').config();

const imgUpload = async(image)=>{
    const s3 = new aws.S3({
        accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
    })
    
    const uploadedImage = await s3.upload({
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: image.name,
        Body: image.data,
        ContentType: image.mimetype,
        // ACL: 'public-read'
      }).promise()

    return uploadedImage.Location;
}

module.exports = {imgUpload}