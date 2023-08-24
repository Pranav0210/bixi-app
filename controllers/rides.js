const Ev = require('../models/model.ev');
const Ride = require('../models/model.ride')
const User = require('../models/model.user')
const {generateOTP} = require('./otp')
const mongoose = require('mongoose')
require('dotenv').config()

const getMyRides = async(req,res)=>{
    const allRides = await Ride.find({});
    res.status(200).send(allRides)
}
const getRides = async(req,res)=>{
    try{
        const allRides = await Ride.find({admin_id:req.session.user_id}).exec();
        res.status(200).send(allRides)
    }
    catch(err){
        console.log(err);
        res.status(500).send(`Failed to fetch rides.`)
    }
}
const getBookings = async(req,res)=>{
    try{
        const bookings = await Ride.find({status:"booked",admin:req.session.user_id}).exec();
        res.status(200).send(bookings)
    }
    catch{
        res.status(404).send(`Request failed.`)
    }
}

const getOngoing = async(req,res)=> {
    try{
        const ongoing = await Ride.find({status:"ongoing"}).exec();
        res.status(200).send(ongoing)
    }
    catch(err){
        console.log(err);
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
    const {ride_start, ride_end, range} = req.body.ride_request
    // const startTime = new Date(ride_start)
    const rangeEvList = await Ev.aggregate([
        { $match: { range: { $gte: range } } },
        {$sort: {range:1, total_rides:1}},
        // {$project: {ev_regd}}
    ]).project("ev_regd -_id  top_speed range").exec()
    strt_time = new Date(ride_start)
    end_time = new Date(ride_end)
    if(strt_time>end_time || strt_time < new Date()){
        res.status(404).send(`Invalid timings`)
        return;
    }
    end_time.setMinutes(end_time.getMinutes()+15)
    console.log(strt_time,end_time)

    const bookedEvs_type1 = await Ride.find({
        $and :[
            {"req_schedule.end":{$gte:end_time}},
            {"req_schedule.start":{$lte:strt_time}},
            {status:{$in:["booked","ongoing"]}}
        ]
    }).select({ev_regd:1}).exec()
    const bookedEvs_type2 = await Ride.find({
        $and :[
            {"req_schedule.start":{$gte:strt_time}},
            {"req_schedule.start":{$lte:end_time}},
            {status:{$in:["booked","ongoing"]}}
        ]
    }).select({ev_regd:1}).exec()
    const bookedEvs_type3 = await Ride.find({
        $and :[
            {"req_schedule.end":{$gte:strt_time}},
            {"req_schedule.end":{$lte:end_time}},
            {status:{$in:["booked","ongoing"]}}
        ]
    }).select({ev_regd:1}).exec()
    const bookedEvs = bookedEvs_type1.concat(bookedEvs_type2,bookedEvs_type3)
    console.log(rangeEvList)
    console.log(bookedEvs)
    const available = rangeEvList.filter((ev)=>{
        if(!bookedEvs.some(booked => booked.ev_regd == ev.ev_regd)){
            console.log(ev)
            return ev;
        }
    })
    //return the cost of the queried ride - UPDATE
    res.status(200).send(available)
}

const newRide = async (req,res)=>{
    const session = await mongoose.startSession() 
    await session.startTransaction();
    // const ride = new Ride(req.body.ride)
    // await ride.save();
    const {ev_regd,req_schedule} = req.body.ride_request;
    strt_time = new Date(req_schedule.start)
    end_time = new Date(req_schedule.end)
    end_time.setMinutes(end_time.getMinutes()+15)
    console.log(strt_time,end_time)
    if(strt_time>end_time || strt_time < new Date()){
        res.status(404).send(`Invalid timings`)
        return;
    }
    try{
        //Check if the ride is actually available now
        const bookedEvs_type1 = await Ride.find({
            $and :[
                {"req_schedule.end":{$gte:end_time}},
                {"req_schedule.start":{$lte:strt_time}},
                {status:{$in:["booked","ongoing"]}}
            ]
        }).select({ev_regd:1, _id:0}).exec()
        const bookedEvs_type2 = await Ride.find({
            $and :[
                {"req_schedule.start":{$gte:strt_time}},
                {"req_schedule.start":{$lte:end_time}},
                {status:{$in:["booked","ongoing"]}}
            ]
        }).select({ev_regd:1}).exec()
        const bookedEvs_type3 = await Ride.find({
            $and :[
                {"req_schedule.end":{$gte:strt_time}},
                {"req_schedule.end":{$lte:end_time}},
                {status:{$in:["booked","ongoing"]}}
            ]
        }).select({ev_regd:1}).exec()
        const bookedEvs = bookedEvs_type1.concat(bookedEvs_type2,bookedEvs_type3)
        console.log(bookedEvs)
        if(bookedEvs.some(booked => booked.ev_regd == ev_regd)){
            res.status(404).send(`Requested ev ${ev_regd} booked already.`)
            session.endSession();
        }
        //CREATE RIDE DOCUMENT
        //IMPLEMENT PRIORITY LOGIC BASED ON BIXI KARMA - UPDATES
        else{
            const {admin} = await Ev.findOne({ev_regd:req.body.ride_request.ev_regd})
            console.log(admin);
            const ride = await Ride.create([{...req.body.ride_request, admin_id:admin, secret:generateOTP()}],{session});
            console.log(ride)
            await session.commitTransaction();
            res.status(201).json({
                done: true,
                ride_object : ride,
                msg : "Ride booked successfully."
            })
        }
    }
    catch(err){
        console.log(err)
        console.log('Aborting Transaction...')
        session.abortTransaction();
        res.status(500).send(`Could not complete transaction please try again...`)
    }
    finally{
        session.endSession();
    }
}

/**
 * Future support to be added for OTP verification of user for ride start
 * @param {*} req 
 * @param {*} res 
 */
const startRide = async(req,res)=>{
    //modify status of ev     
    const session  = await mongoose.startSession();
    await session.startTransaction();
    try{
        const startedRide = await Ride.findOneAndUpdate(
            {_id:req.body.ride_id},
            {
                helmet:req.body.helmet_qty,
                status:'ongoing',
                ride_time:{start: new Date()}
            },{new:true},{session})
        
        console.log(`ride started : ${startedRide.acknowledged}`)
    
        await Ev.findOneAndUpdate({ev_regd: req.body.ev_regd},{
            status : 'running',
            // this_ride : req.body.ride_id
        },{session})
        await session.commitTransaction();
        res.status(201).send({
            ride_object : startedRide,
            msg: `Ride started`
        })
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
const requestfinish = async(req,res)=>{
    const {requestedEndTime, ride_id} = req.body
    const ride = await Ride.findOne({_id:ride_id}).exec();
    console.log(req.session.user_id)
    if(ride.rider_id != req.session.user_id){
        console.log(`User mismatch`)
        res.status(403).send(`Unaccessible ride. User doesn't match`)
    }
    else if(requestedEndTime < ride.req_schedule.end){
        res.status(400).send(`Cannot end ride before booking finish`)
    }
    else{
        // if(requestedEndTime.getHours() == ride.endRequests.findLast().getHours() && 
        //     requestedEndTime.getMinutes() == ride.endRequests.findLast().getMinutes())
        //     res.status(400).send(`Too many requests`)
        try{
            ride.endRequests.push(requestedEndTime)
            await ride.save()
            res.status(200).send(`Request registered successfully`)
        }
        catch(err){
            console.log(err)
            res.status(500).send(`Failed to request ride termination`)
        }
    }
}
const finishRide = async(req,res)=>{
    const session = mongoose.startSession();
    await session.startTransaction();
    const {end_time, kms, ride_id, ev_regd, duration} = req.body.ride;
    try{
        const finishedRide = await Ride.findOneAndUpdate({_id:ride_id, },
            {
                status :'completed',
                ride_time : {
                    end : end_time,
                    duration : duration
                },
                distance : kms
            },{session})
        //modify total_rides total_hrs total_kms last_ride and status of ev
        const this_ev = await Ev.findOneAndUpdate({ev_regd:ev_regd},{
            $set : {
                status : 'idle',
            },
            $inc:{
                total_rides : 1,
                total_hrs : (end_time - finishedRide.ride_time.start),
                total_kms : kms,
            }
            // this_ev.last_ride = this_ev.this_ride,
            // this_ev.this_ride = null,

        },{session})
        //modify total_rides count in user
        const rider = await User.findOneAndUpdate({_id : finishedRide.rider_id},{
            $inc : {
                total_rides : 1
            },
            $set : {
                last_ride : ride_id
            }
        },{session})
        //modify user bixi karma -  LATER upgrade
        
        //calculate fare and send bill for the ride
        const bill = await generateBilling(finishedRide, this_ev.model, rider.contact)
        //console.log(`ride finished : ${finishedRide.acknowledged}`)
        await session.commitTransaction()
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
    try{
        const cancel_ride = await Ride.findOneAndUpdate({_id: req.body.ride_id},{status : 'cancelled'},{new:true})
        res.status(200).json({
            msg:`Ride cancelled`,
            ride_object : cancel_ride
        })
    }
    catch(err){
        console.log(err)
        res.status(500).send(`Failed to cancel ride.`)
    }
    // await cancel_ride.save()
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
    getOngoing,
    getMyBooking, 
    getBookings, 
    addBookings, 
    getAvailable, 
    startRide, 
    finishRide,
    requestfinish }