var router = require('express').Router();
const { updatePatientPassword } = require('../../controllers/patient/changePasswordController');

router.put('/', updatePatientPassword);

module.exports = router;