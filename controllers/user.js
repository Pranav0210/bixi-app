const User = require('../models/model.user')
const getUser = async (req,res)=>{
    const user = await User.findOne({...req.body.user_details})
    res.status(200).send(`User Details : ${user}`)
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
            const newUser = new User({...req.body.update_fields})
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