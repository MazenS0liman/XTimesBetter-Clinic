var router = require('express').Router();
const { getDoctorInfo } = require('../../controllers/doctor/doctorInfoController');

router.get('/', getDoctorInfo);

module.exports = router;