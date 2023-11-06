var router = require('express').Router();
const { getPatientInfo } = require('../../controllers/patient/patientInfoController');

router.get('/', getPatientInfo);

module.exports = router;