var router = require('express').Router();
const { viewHealthRecords } = require('../../controllers/patient/viewHealthRecordsController.js');
const { authenticateToken } = require('../../middleware/authenticateToken');

// const { removePharmacist } = require('../../controllers/pharmacist/pharmacistcontroller.js');
// const {removePatient} = require('../../controllers/patient/patientcontroller.js');

// APIs

router.get('/', authenticateToken, viewHealthRecords);

module.exports = router;
