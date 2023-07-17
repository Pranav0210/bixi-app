const express = require('express')
const router = express.Router()
const {getUser, saveUser, deleteUser} = require('../controllers/user')
// import User from "../models/model.user"

router.route('/profile')
    .get(getUser)
    .post(saveUser)
    .delete(deleteUser)
router.patch('/update', saveUser)
// router.delete('/delete',deleteUser)


module.exports = router