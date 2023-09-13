const uploadImg = require("./s3.upload");

const uploadFile = async(req, res) => {
  uploadImg(req, res, async function(err){
    
     if(err){
        console.log(err)
        return res.status(400).send({
            result: 0,
            message: err,
        });
     }
     console.log(req.file)
     return res.status(200).send({
        result: 1,
        location:req.file,
        message: "uploaded successfully",
        
     });
  })
};

module.exports = {
  uploadFile
};