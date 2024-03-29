const Billing = require('../models/model.billing')
const Coupon = require('../models/model.coupon')
const Price = require('../models/model.price')


const createCoupon = async(req,res)=>{

}

const getRates = async()=>{
    //check available offers
    return {
        fare_rate : 1,
        fixed_adv : 60,
        helm_rate : 5,
        damage_rate : 0,
        delay_rate : 1.5
    }
}
const createBill = async(ride,ev,contact)=>{
    const {
        _id, 
        ev_regd,  
        rider_id, 
        ride_time,
        helmet,
        distance,
        req_schedule,
    } = ride
    // consol.log(ride)
    // const {
    //     delay_rate,
    //     helm_rate,
    //     damage_rate,
    //     fare_rate,
    //     fixed_adv,

    // } = await Price.findOne().exec();
    const fare_rate = 1,fixed_adv = 60, helm_rate = 5/60, damage_rate = 0, delay_rate = 0.2
    var base_fare = fare_rate*ride_time.duration
    if(helmet > 2 || helmet < 0){
        res.status(400).send(`Invalid helmet count`)
    }
    var rent = Math.round(ride_time.duration*helmet*helm_rate)
    const penalty = {
        damage : damage_rate,
        delay : delay_rate*(req_schedule.end < ride_time.end ? ride_time.end - req_schedule.end : 0 )/60000
    }
    const total_fare = Math.max(fixed_adv, base_fare)+penalty.damage+penalty.delay+rent;

    const bill = new Billing({
        ride_id : _id,
        ev_regd : ev_regd,
        rider_id : rider_id,
        rider_contact: contact,
        ride_time : ride_time,
        distance : distance,
        fare_rate : fare_rate,
        base_fare : fare_rate*ride_time.duration,
        fixed_adv : fixed_adv,
        helmet : {
            qty : helmet,
            rent : rent
        },
        penalty : penalty,
        total_fare : total_fare,
        generated_time : new Date() 
    })

    await bill.save();
    return bill
}

module.exports = {createCoupon,createBill}