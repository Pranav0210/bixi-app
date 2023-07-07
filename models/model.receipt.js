const mongoose = require('mongoose')

const ReceiptSchema = mongoose.Schema({
    receipt_id : {type:mongoose.Schema.objectId, required:true},
    ride_id : {type:mongoose.Schema.objectId, required:true},
    ev_regd : {type:String, required:true},
    rider_id : {type:mongoose.Schema.objectId, required:true},
    rider_contact: {type:Number},
    ride_time : {
        start : {type:Date},
        end : {type:Date},
        duration : {type:Number},
    },
    distance : {type:Number, requred:true},
    base_fare : {type:Number, required:true},
    fixed_adv : {type:Number, required:true},
    penalty : {type:Number, required:true},
    total_fare : {type:Number, required:true},
    generated_time : {type:Date}
});

Receipt.pre('save', ()=>{
    this.receipt_id = this._id;
});

module.exports = mongoose.model('Receipt', ReceiptSchema)