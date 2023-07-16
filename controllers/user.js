const User = require('../models/model.user')
const { imgUpload } = require('./aws-controller')

const getUser = async (req,res)=>{
    console.log(req.body.user_details)
    if(Object.entries(req.body.user_details).length > 0){
        const user = await User.findOne({contact : req.body.user_details.contact})
        if(user)
        res.status(200).send(`User Details : ${user}`)
        else
        res.status(404).send(`User doesn't exist.`)
    }
    else 
        res.status(404).send('Query empty!')
}
const saveUser = async(req,res)=>{
    try{
        let findResult = await User.findOne({contact:req.body.query_field.contact}).exec();
        console.log(findResult)
        if(findResult){
            findResult = {... findResult, ...req.body.update_fields}
            await findResult.save();
            res.status(204).send(`User updated successfully.`)
        }
        else{
            req.files.forEach(async(img,index) => {
                const imgPath = img.path
                const blob = fs.readFileSync(imgPath)
                imgUrls[index] = await imgUpload(blob) 
            })
            const newUser = new User({...req.body.update_fields, img : imgUrls[0], document_img : imgUrls[1]})
            await newUser.save();
            res.status(201).send(`user created`)
        }
    }
    catch(err){
        res.send(`error: ${err}`)
    }
}
const userQuery = async (req,res)=>{
    const queryResult = await User.find(req.body.query_fields)
    res.status(200).send(queryResult);
}
const deleteUser = async(req,res)=>{
    const deletedCount = await User.deleteOne({...req.body.query_field.contact})
    res.send(`Deleted ${deletedCount} user profile`)
}

module.exports = {getUser,saveUser,userQuery,deleteUser}