const express = require('express')
const router = express.Router()
const {getEv,saveEv,evQuery,deleteEv} = require('../controllers/ev')
// import User from "../models/model.user"

router.route('/data')
    .get(getEv)
    .delete(deleteEv)
router.route('/new')
    .post(saveEv)
router.patch('/update', saveEv)
// router.post('/delete',deleteUser)


module.exports = router