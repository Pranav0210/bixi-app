const mongoose = require('mongoose')

const UserSchema = mongoose.Schema({
    name : {type:String},
    dob: {type:Date},
    img:{type:String},
    contact: {type:Number, required:true},
    current_addr : {type:String},
    last_ride : {type:mongoose.Types.ObjectId},
    total_rides:{type:Number,default:0},
    id_proof :{
        doc_id : {type:String},
        doc_img:{type:String},
        doc_type : {
        type:String,
        enum : ['PAN', 'DL'],
        default : 'DL',  
        }
    },
    aadhar:{type:Number, required:true},
    aadhar_img:{type:String, required:true},
    bixi_karma : {type:Number}
},
{timestamp:true});

module.exports = mongoose.model('User', UserSchema);