const mongoose = require('mongoose')


const RideSchema = mongoose.Schema({
    ride_id : {type:mongoose.Types.ObjectId, required:true},
    ev_regd : {type:String, required:true},
    rider_id : {type:mongoose.Types.ObjectId, required:true},
    req_schedule : {
        start : {type:Date},
        end : {type:Date}},
    ride_time : {
        start : {type:Date},
        end : {type:Date},
        duration : {type:Number},
    },
    distance : {type:Number},
    helmet : {type:Number},
    status : {
        type:String, 
        enum: {
            values: ['ongoing', 'completed', 'cancelled', 'booked'],
            message:'enum validator failed for path `{PATH}` with value `{VALUE}`'
        },
        default:'booked',
        required:true
    },
    location:{type:String},
    
},
{timestamp:true});


RideSchema.pre('save', ()=>{
    this.ride_id = this._id;
});

module.exports = mongoose.model('Ride', RideSchema)