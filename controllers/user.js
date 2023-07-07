const User = require('../models/model.user')
const getUser = async (req,res)=>{
    const user = await User.findOne({...req.body.user_details})
    res.status(200).send(`User Details : ${user}`)
}
const saveUser = async(req,res)=>{
    try{
        const saveResult = await User.updateOne({...req.body.user_details},{upsert:true});
        res.status(200).send({
            matched: saveResult.matchedCount,
            newUpsert: saveResult.upsertedId,
            done : saveResult.acknowledged
        })
    }
    catch(err){
        res.send(`error: ${err}`)
    }
}
const userQuery = async (req,res)=>{
    const queryResult = await User.find(req.body.query)
    res.status(200).send(queryResult);
}
const deleteUser = async(req,res)=>{
    const deletedCount = await User.deleteOne({...req.body.del_query})
    res.send(`Deleted ${deletedCount} user profile`)
}

module.exports = {getUser,saveUser,userQuery,deleteUser}