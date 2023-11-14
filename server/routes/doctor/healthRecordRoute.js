var router = require('express').Router();
const { uploadHealthRecord, upload } = require('../../controllers/doctor/healthrecordsController.js');
const { authenticateToken } = require('../../middleware/authenticateToken');

// const { removePharmacist } = require('../../controllers/pharmacist/pharmacistcontroller.js');
// const {removePatient} = require('../../controllers/patient/patientcontroller.js');

// APIs
router.post('/:user', authenticateToken, uploadHealthRecord);
module.exports = router;