var router = require('express').Router();
const { viewPHealthRecords} = require('../../controllers/doctor/viewHealthController.js');
const { authenticateToken } = require('../../middleware/authenticateToken');

// const { removePharmacist } = require('../../controllers/pharmacist/pharmacistcontroller.js');
// const {removePatient} = require('../../controllers/patient/patientcontroller.js');

// APIs
router.get('/:user', authenticateToken, viewPHealthRecords);
module.exports = router;