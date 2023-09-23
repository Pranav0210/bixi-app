const uploadFile = require("../controllers/upload-controller");
const express = require("express");
const router = express.Router();

//router.post('/image-upload', s3Controller.uploadFile);
router.post("/image-upload", uploadFile);

module.exports = router;