var router = require('express').Router();
const { createAppointment, getAppointments } = require('../../controllers/patient/appointmentController');

// APIs
router.post('/', createAppointment);
router.get('/', getAppointments);


module.exports = router;