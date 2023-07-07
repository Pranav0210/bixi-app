const mongoose = require("mongoose")

const Coupon = new mongoose.Schema({
    value: { type: Number, required: true },
    validity: { type: Date, required: true },
    owner:{type:mongoose.Schema.Types.ObjectId}
})