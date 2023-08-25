const express = require('express')
const router = express.Router()
const {getUser,getAllUsers,saveUser} = require('../controllers/user')
const {adminAuth} =  require('../middleware/authorize')
const { getEv,getAllEvs, deleteEv, saveEv } = require('../controllers/ev')
const {createAdmin} = require('../controllers/admin')
const {getRides,
        editRide,
        cancelRide,
        getRide,
        newRide,
        getBookings,
        addBookings, 
        getOngoing, 
        startRide, 
        finishRide, 
        getFinishRequests} = require('../controllers/rides')

router.use(adminAuth)
router.route('/user')
.get(getUser)
.post(saveUser)
router.route('/access')
.get()
.post()

router.post('/new-admin',createAdmin)

router.get('/all-users',getAllUsers)
router.get('/all-ev',getAllEvs)
router.get('/all-rides',getRides)
router.get('/end-requests', getFinishRequests)


router.route('/ev')
    .get(getEv)
    .post(saveEv)
    .delete(deleteEv)
router.route('/ride')
    .get(getRide)
    .post(newRide)
router.post('/ride-start', startRide)
router.post('/ride-finish', finishRide)
router.route('/ongoing')
    .get(getOngoing)
router.route('/bookings')
    .get(getBookings)
    .post(addBookings)
router.route('/cancel_ride')
    .post(cancelRide)
router.route('/edit_ride')
    .post(editRide)
module.exports = router