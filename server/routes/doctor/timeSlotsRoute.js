var router = require('express').Router();
const { addTimeSlot } = require('../../controllers/doctor/addAvailableTimeSlotsController.js');

// const { removePharmacist } = require('../../controllers/pharmacist/pharmacistcontroller.js');
// const {removePatient} = require('../../controllers/patient/patientcontroller.js');
// APIs
router.post('/', addTimeSlot);


module.exports = router;
