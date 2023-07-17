const mongoose = require('mongoose')

const BillingSchema = mongoose.Schema({
    billing_id : {type:mongoose.Schema.objectId, required:true},
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
    fare_rate : {type:Number, required:true},
    base_fare : {type:Number, required:true},
    fixed_adv : {type:Number, required:true},
    helmet : {
        qty : {type:Number},
        rent : {type:Number}
    },
    penalty : {
        damage : {type:Number},
        delay : {type:Number}
    },
    total_fare : {type:Number, required:true},
    generated_time : {type:Date}                                       
});

Billing.pre('save', ()=>{
    this.billing_id = this._id;
});

module.exports = mongoose.model('Billing', BillingSchema)