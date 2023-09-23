const express = require('express')
const router = express.Router()
const {getUser, saveUser, deleteUser} = require('../controllers/user')
// import User from "../models/model.user"

router.get('/profile',getUser)
router.post('/create-profile',saveUser)
router.delete('/delete',deleteUser)
router.patch('/update', saveUser)
// router.delete('/delete',deleteUser)

module.exports = router