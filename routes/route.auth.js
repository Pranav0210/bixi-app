const express = require("express")
const router = express.Router()
const {sendOtp, verifyOtp} = require('../controllers/otp')

router.get('/')
router.route('/send-otp').post(sendOtp)
// router.route('/verify-otp').post(verifyOtp)

module.exports = router