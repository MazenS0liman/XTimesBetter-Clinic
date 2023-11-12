var router = require('express').Router();
const { viewPHealthRecords} = require('../../controllers/doctor/viewHealthController.js');

// const { removePharmacist } = require('../../controllers/pharmacist/pharmacistcontroller.js');
// const {removePatient} = require('../../controllers/patient/patientcontroller.js');

// APIs
router.get('/:user', viewPHealthRecords);
module.exports = router;