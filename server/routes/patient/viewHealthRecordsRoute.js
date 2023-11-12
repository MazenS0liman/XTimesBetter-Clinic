var router = require('express').Router();
const { viewHealthRecords } = require('../../controllers/patient/viewHealthRecordsController.js');

// const { removePharmacist } = require('../../controllers/pharmacist/pharmacistcontroller.js');
// const {removePatient} = require('../../controllers/patient/patientcontroller.js');

// APIs

router.get('/', viewHealthRecords);

module.exports = router;
