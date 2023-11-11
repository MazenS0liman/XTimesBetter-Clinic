var router = require('express').Router();
const { getUpcomingAppointments , getPastAppointments, scheduleFollowUpAppointment } = require('../../controllers/doctor/doctorAppointments')
const { authenticateToken } = require('../../middleware/authenticateToken');

// Get all doctor upcoming appointments
router.get('/upcomingAppointments', authenticateToken, getUpcomingAppointments)

// Get all doctor past appointments
router.get('/pastAppointments', authenticateToken, getPastAppointments)

// Doctor schedules a follow up with a patient.
router.post('/scheduleFollowUp', scheduleFollowUpAppointment)

module.exports = router;