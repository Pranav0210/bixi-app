const mongoose = require('mongoose')

const PriceSchema = mongoose.Schema({
    ev_model:{type:String},
    delay_rate:{type:Number},
    helm_rate:{type:Number},
    damage_rate:{type:Number},
    fare_rate:{type:Number},
    fixed_adv:{type:Number},
},
{timestamp:true});

module.exports = mongoose.model('Price', PriceSchema)