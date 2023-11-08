var router = require('express').Router();
const { getPatients } = require('../../controllers/doctor/viewPatientController');
const { authenticateToken } = require('../../middleware/authenticateToken');

// APIs
router.get('/', authenticateToken, getPatients);

module.exports = router;