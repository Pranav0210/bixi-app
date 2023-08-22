const mongoose = require('mongoose')

const EvSchema = mongoose.Schema({
    ev_id : {type:mongoose.Schema.Types.ObjectId, required: true},
    admin: {type:mongoose.Schema.Types.ObjectId, required:true},
    ev_regd : {type:String, required:true},
    type : {type:String},
    image : {type:String},
    make : {type:String},
    model : {type:String},
    color : {type:String},
    top_speed:{type:Number, required:true},
    weight_capacity:{type:Number, required:true},
    range : {type:Number, required:true},
    total_rides : {type:Number},
    total_hrs : {type:Number},
    total_kms : {type:Number},
    last_ride : {type:mongoose.Schema.Types.ObjectId},
    this_ride: {type:mongoose.Types.ObjectId},
    status: {
        type: String,
        enum: {
            values: ['idle', 'running', 'maintenance'],
            message: 'enum validator failed for path `{PATH}` with value `{VALUE}`'
        },
        default: 'idle',
        required: true
    }
},
{timestamp:true});

EvSchema.pre('save', ()=>{
    this.ev_id = this._id;
    next();
});

module.exports = mongoose.model('Ev', EvSchema)