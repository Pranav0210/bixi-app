const mongoose = require('mongoose')

const AdminSchema = mongoose.Schema({
    name : {type:String},
    dob: {type:Date},
    img:{type:String},
    contact: {type:Number, required:true},
    current_addr : {type:String},
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
    rides_approved: {type:Number},
    rides_declined: {type:Number},
    rides_closed: {type:Number}
})

module.exports = mongoose.model('Admin', AdminSchema)