const express = require('express')
const { newRide,getMyRides,cancelRide,getBookings,getAvailable,startRide,finishRide} = require('../controllers/rides')
const router = express.Router()

router.route('/user-rides')
    .get(getMyRides)
router.route('/book')
    .post(newRide)
router.route('/start')
    .post(startRide)
router.route('/finish')
    .post(finishRide)
router.route('/cancel')
    .patch(cancelRide)
router.route('/available')
    .get(getAvailable)

module.exports = router