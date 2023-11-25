const express = require('express')
const { 
    newRide,
    getMyRides,
    cancelRide,
    getBookings,
    getAvailable,
    startRide,
    finishRide, 
    requestfinish, 
    getPastBookings,	
    getRecentUserBooking, 
    getBill, 
    updateTxns, 
    getAllStations,
    getAdmin,	
    getAdminByStation} = require('../controllers/rides')
    
const router = express.Router()
router.get('/get-past-bookings',getPastBookings)
router.route('/user-rides')
    .get(getMyRides)
router.route('/book')
    .post(newRide)
router.post('/request-end',requestfinish)
router.get('/recent-user-booking', getRecentUserBooking)
router.post('/bill',getBill)
router.patch('/update-ride-txns',updateTxns)
// USER ACCESS REVOKED
// router.route('/start')
//     .post(startRide)
// router.route('/finish')
//     .post(finishRide)
router.route('/cancel')
    .patch(cancelRide)
router.route('/available')
    .post(getAvailable)
router.get('/stations', getAllStations)
router.get('/admin', getAdmin)
router.post('/admin-by-station', getAdminByStation)

module.exports = router
