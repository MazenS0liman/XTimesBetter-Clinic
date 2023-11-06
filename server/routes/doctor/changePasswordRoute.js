var router = require('express').Router();
const { updateDoctorPassword } = require('../../controllers/doctor/changePasswordController');

router.put('/', updateDoctorPassword);

module.exports = router;