const User = require('../models/model.user')
const { imgUpload } = require('./aws/aws-controller')

const getUser = async (req,res)=>{
    // console.log(req.session)
    try{
        const user = await User.findOne({_id : req.session.user_id})
        if(user)
        res.status(200).json(user)
        else
        res.status(404).send(`User doesn't exist.`)
    }
    catch(e){
        console.log(e);
    }
    // if(Object.entries(req.body.user_details).length > 0){
    // }
    // else 
    //     res.status(404).send('Query empty!')
}
const getAllUsers = async (req,res)=>{
    
    try{
        const UserList = await User.find({}).exec();
        res.status(200).send(UserList);
    }
    catch(err){
        console.log(err)
        res.status(500).send(`Error Listing Users`)
    }
}
/**
 * MUST NOT be used to update contact details of user else it will update the images to a , provide support later
 * @param {*} req 
 * @param {*} res 
 */
const saveUser = async(req,res)=>{
    try{
        // var {update_fields} = req.body.update_fields;
        const options = {upsert:true,setDefaultsOnInsert:true,new:true}
        await User.findOneAndUpdate(req.body.query_field,req.body.update_fields, options)
        .then((result)=>{
                req.session.user_id = result._id;
		        console.log(`User updated successfully:${result}`)
        })
        if(req.files &&  req.files.length > 0){
            var imgUrls = []
            req.files.forEach(async(img,index) => {
                const imgPath = img.path
                const blob = fs.readFileSync(imgPath)
                imgUrls[index] = await imgUpload(blob) 
            })
            await User.findOneAndUpdate(req.body.query_field,{ img : imgUrls[0], aadhar_img : imgUrls[1]}, options )
            .then((result)=>{
                console.log(`User images updated successfully: ${result}`)
            })
        }
        res.status(201).send(`User updated successfully`)
        
        // else{
        //     }
        //     const newUser = new User({...req.body.update_fields, img : imgUrls[0], document_img : imgUrls[1]})
        //     await newUser.save();
        //     res.status(201).send(`user created`)
        // }
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

module.exports = {getUser,getAllUsers,saveUser,userQuery,deleteUser}
