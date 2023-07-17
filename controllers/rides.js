const Ev = require('../models/model.ev');
const Ride = require('../models/model.ride')
const User = require('../models/model.user')
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
    //return the cost of the queried ride - UPDATE
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
        res.status(500).send(`Could not complete transaction please try again...`)
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
    try{
        const startedRide = await Ride.findOneAndUpdate(
            {ride_id:req.body.ride_id},
            {
                helmet:req.body.helmet_qty,
                status:'ongoing',
                ride_time:{start: new Date()}
            },{session}).exec()
        
        console.log(`ride started : ${startedRide.acknowledged}`)
    
        await Ev.findOneAndUpdate({ev_regd: req.body.ev_regd},{
            status : 'running',
            this_ride : req.body.ride_id
        },{session}).exec()
        session.commitTransaction();
        res.status(201).send(`Ride start initiated`)
    }
    catch(err){
        console.log(`Ride initiation aborted : ERR ${err}`)
        session.abortTransaction();
        res.status(500).send('Ride initiation failed.')
    }
    finally{
        session.endSession();
    }
}
const finishRide = async(req,res)=>{
    const session = mongoose.startSession();
    await session.startTransaction();
    const {end_time, kms, ride_id, ev_regd} = req.body.ride;
    try{
        const finishedRide = await Ride.findOne({ride_id:ride_id},{session}).exec()
        const this_ev = await Ev.findOne({ev_regd:ev_regd},{session}).exec()
        const rider = await User.findOne({_id : finishedRide.rider_id},{session}).exec()
        
        finishedRide.status='completed';
        finishedRide.ride_time.end = end_time
        finishedRide.distance = kms
        await finishedRide.save({session});
        
        //modify total_rides total_hrs total_kms last_ride and status of ev
        this_ev.status = 'idle'
        this_ev.total_rides++;
        this_ev.total_hrs += (end_time - finishedRide.ride_time.start)
        this_ev.total_kms += kms
        this_ev.last_ride = this_ev.this_ride
        this_ev.this_ride = null
        await this_ev.save({session})
        //modify total_rides count in user
        //modify user bixi karma
        rider.total_rides++;
        rider.last_ride = ride_id
        await rider.save({session})
        //calculate fare and send bill for the ride
        const bill = await generateBilling(finishedRide, this_ev.model, rider.contact)
        //console.log(`ride finished : ${finishedRide.acknowledged}`)
        session.commitTransaction()
        res.status(200).json({
            msg: `Ride status : finished`,
            bill: bill 
        })
    }
    catch(err){
        (await session).abortTransaction();
        console.log(`Transaction failed : aborting changes`)
        res.status(500).send(`Couldn't finish ride : ride not terminated`)
    }
    finally{
        (await session).endSession();
    }
}
const cancelRide = async(req,res)=>{
    const cancel_ride = await Ride.findOne({ride_id: req.body.ride_id}).exec()
    cancel_ride.status = 'cancelled'
    await cancel_ride.save()
    res.status(200).send(`Ride cancelled`)
}
const editRide = async()=>{
    const updatedRide = await Ride.findOneAndUpdate({ride_id:req.body.ride_id},{...req.body.updateFields})
    console.log(`ride Edited : ${updatedRide.acknowledged}`)
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