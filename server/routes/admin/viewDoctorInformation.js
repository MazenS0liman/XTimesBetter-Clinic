const router = require('express').Router();
const { viewDoctorInfo } = require('../../controllers/doctor/doctorProfileController');

router.get('/',viewDoctorInfo);
module.exports = router;