var router = require('express').Router();
const { createAppointment, getAppointments, getUpcomingAppointments, getPastAppointments } = require('../../controllers/patient/appointmentController');

// APIs
router.post('/createAppointment', createAppointment);
router.get('/', getAppointments);

// Get all upcoming appointments.
router.get('/upcomingAppointments', getUpcomingAppointments);

// Get all past appointments.
router.get('/pastAppointments', getPastAppointments)
module.exports = router;