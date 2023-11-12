var router = require('express').Router();
const { uploadHealthRecord, upload } = require('../../controllers/doctor/healthrecordsController.js');

// const { removePharmacist } = require('../../controllers/pharmacist/pharmacistcontroller.js');
// const {removePatient} = require('../../controllers/patient/patientcontroller.js');

// APIs
router.post('/', uploadHealthRecord);
module.exports = router;