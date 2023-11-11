var router = require('express').Router();
const { createAppointment, getAppointments, getUpcomingAppointments, getPastAppointments } = require('../../controllers/patient/appointmentController');
const { authenticateToken } = require('../../middleware/authenticateToken');

// APIs
router.post('/createAppointment', createAppointment);
router.get('/', getAppointments);

// Get all upcoming appointments.
router.get('/upcomingAppointments', authenticateToken, getUpcomingAppointments);

// Get all past appointments.
router.get('/pastAppointments', authenticateToken, getPastAppointments)
module.exports = router;