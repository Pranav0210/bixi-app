const express = require('express')
const router = express.Router()
const {getUser, saveUser, deleteUser} = require('../controllers/user')
// import User from "../models/model.user"

router.get('/:user_id',getUser)
router.route('/profile')
    .post(saveUser)
    .delete(deleteUser)
router.patch('/update', saveUser)
// router.delete('/delete',deleteUser)


module.exports = router