const mongoose = require("mongoose")

const Coupon = new mongoose.Schema({
    value: { type: Number, required: true },
    validity: { type: Date, required: true },
    created : {type: Date, required:true},
    createdBy : {type:mongoose.Types.ObjectId},
    owner:{type:mongoose.Schema.Types.ObjectId}
})

module.exports = mongoose.model('Coupon', Coupon);