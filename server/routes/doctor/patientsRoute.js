var router = require('express').Router();
const { getPatients } = require('../../controllers/doctor/viewPatientController');

// APIs
router.get('/', getPatients);

module.exports = router;