const Ev = require('../models/model.ev');
const Ride = require('../models/model.ride')
const mongoose = require('mongoose')
require('dotenv').config()

const getMyRides = async(req,res)=>{
    const allRides = await Ride.find({});
    res.status(200).send(allRides)
}
const getRides = async(req,res)=>{
    const allRides = await Ride.find({});
    res.status(200).send(allRides)
}
const getBookings = async(req,res)=>{
    try{
        const bookings = await Ride.find({status:"booked"}).exec();
        res.status(200).send(bookings)
    }
    catch{
        res.status(404).send(`Request failed.`)
    }
}
const getMyBooking = async(req,res)=>{
    try{
        const booking = await Ride.findOne({status:"booked"});
        res.status(200).send(booking)
    }
    catch{
        res.status(404).send(`Request failed.`)
    }
}

const addBookings = async(req,res)=>{
    const bookings_arr = req.body.bookings;
    Ride.insertMany(bookings_arr,(err,mongoose)=>{
        if(err){
            console.log(`error : ${err}`)
        }
        else{
            console.log('accepted documents :\n'+mongoose.results)
            res.status(201).send(`New bookings added.`)
        }
    },{ordered:false, rawResult:true})
}
const getRide = async(req,res)=>{
    try{
        const {ride_id} = await Ride.exists(req.ride_query)
        if(ride_id){
            const ride = await Ride.find({'ride_id': ride_id}).exec()
            res.status(200).json(ride)
        }
        else{
            res.status(404).send(`Fetch operation failed.`)
        }
    }
    catch(err){
        res.send("error : "+ err)
    }
}

const getAvailable = async (req,res)=>{
    const {ride_start, ride_end, range,} = req.body.ride_request
    // const startTime = new Date(ride_start)
    const rangeEvList = Ev.aggregate([
        { $match: { range: { $gte: range } } },
        {$sort: {range:1, total_rides:1}},
        {$project: {ev_regd}}
    ])
    strt_time = new Date(ride_start)
    end_time = new Date(ride_end)
    end_time.setMinutes(end_time.getMinutes()+15)

    const bookedEvs = Ride.find({
        $and:[
            {$or:[
                {req_schedule:{start:{$lt:end_time}}},
                {req_schedule:{end:{$gt:strt_time}}}
            ]},
            {status:'booked'}
        ]}).project({ev_regd:1}).exec()
    
    const available = rangeEvList.filter((booking)=>{
        if(!bookedEvs.includes(booking))
        return booking;
    })
    res.status(200).send(available)
}

const newRide = async (req,res)=>{
    const session = await mongoose.startSession() 
    await session.startTransaction();
    // const ride = new Ride(req.body.ride)
    // await ride.save();
    const {ev_regd} = req.body.ride_request;
    try{
        //Check if the ride is actually available now
        const bookedEvs = Ride.find({
            $and:[
                {$or:[
                    {req_schedule:{start:{$lt:end_time}}},
                    {req_schedule:{end:{$gt:strt_time}}}
                ]},
                {status:'booked'}
            ]},{session}).project({ev_regd:1}).exec()
        if(bookedEvs.includes(ev_regd)){
            res.status(404).send(`The requested ev ${ev_regd} is booked already.`)
        }
        //CREATE RIDE DOCUMENT
        //IMPLEMENT PRIORITY LOGIC BASED ON BIXI KARMA - UPDATES
        const ride = new Ride(req.body.ride_request)
        var id;
        ride.save((err,new_ride)=>{
            id = new_ride._id;
        },{session});
        session.commitTransaction();
        res.status(201).json({
            done: true,
            ride_id : id,
            msg : "Ride booked successfully."
        })
    }
    catch(err){
        console.log('Aborting Transaction...')
        session.abortTransaction();
        res.send(`Could not complete transaction please try again...`)
    }
    finally{
        session.endSession();
    }
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
const startRide = async(req,res)=>{
    //modify status of ev     
    const session  = await mongoose.startSession();
    await session.startTransaction();
    const startedRide = await Ride.findOneAndUpdate(
        {ride_id:req.body.ride_id},
        {
            status:'ongoing',
            ride_time:{start: new Date()}
        })
    
    console.log(`ride started : ${startedRide.acknowledged}`)
    res.status(200).send(`Ride started successfully!`)
}
const finishRide = async(req,res)=>{
    //modify user bixi karma
    //modify total_rides count in user
    //modify toatl_rides total_hrs total_kms last_ride and status of ev
    //send bill for the ride
    const session = mongoose.startSession();
    await session.startTransaction();
    const finishedRide = await Ride.findOne({ride_id:req.body.ride_id}).exec()
        
        finishedRide.status='completed';
        finishedRide.ride_time.end = new Date()
        await finishedRide.save();
        
    // console.log(`ride finished : ${finishedRide.acknowledged}`)
    res.status(200).send(`Ride status : finished`)
}
const cancelRide = async(req,res)=>{
    const cancel_ride = await Ride.findOne({ride_id: req.body.ride_id}).exec()
    cancel_ride.status = 'cancelled'
    await cancel_ride.save()
    res.status(200).send(`Ride cancelled`)
}
const editRide = async()=>{
    const updatedRide = await Ride.findOneAndUpdate({ride_id:req.body.ride_id},{...req.body.updateFields})
    // console.log(`ride Edited : ${updatedRide.acknowledged}`)
    res.status(200).send(`Ride modified successfully!`)
}

module.exports = { 
    getMyRides, 
    getRide, 
    getRides, 
    newRide, 
    cancelRide, 
    editRide,
    getMyBooking, 
    getBookings, 
    addBookings, 
    getAvailable, 
    startRide, 
    finishRide }