var router = require('express').Router();
const { addTimeSlot } = require('../../controllers/doctor/addAvailableTimeSlotsController.js');
const { authenticateToken } = require('../../middleware/authenticateToken');

// const { removePharmacist } = require('../../controllers/pharmacist/pharmacistcontroller.js');
// const {removePatient} = require('../../controllers/patient/patientcontroller.js');
// APIs
router.post('/', authenticateToken, addTimeSlot);


module.exports = router;
