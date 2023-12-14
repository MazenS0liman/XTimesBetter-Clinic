const router = require('express').Router();
const { updateDoctorInfo, viewDoctorInfo} = require("../../controllers/doctor/doctorProfileController.js");

// APIs
router.post('/viewDoctorInfo', viewDoctorInfo);
router.patch('/updateDoctorInfo', updateDoctorInfo);

module.exports = router;