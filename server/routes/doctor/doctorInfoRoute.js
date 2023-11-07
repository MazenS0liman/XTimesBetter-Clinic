var router = require('express').Router();
const { getDoctorInfo } = require('../../controllers/doctor/doctorInfoController');
const { authenticateToken } = require('../../middleware/authenticateToken');

router.get('/', authenticateToken, getDoctorInfo);

module.exports = router;