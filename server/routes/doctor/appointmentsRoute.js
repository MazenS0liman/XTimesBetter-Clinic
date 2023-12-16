var router = require('express').Router();
const { getAppointments,getUpcomingAppointments , getPastAppointments, scheduleFollowUpAppointment, getScheduledFollowUp, rescheduleAppointment, cancelAppointment, getPastAppointmentsFollowUp, checkFollowUpStatus } = require('../../controllers/doctor/doctorAppointments')
const { authenticateToken } = require('../../middleware/authenticateToken');

// Get all doctor Appointments
router.get('/getAppointments', authenticateToken, getAppointments);

router.post('/checkFollowUpStatus',checkFollowUpStatus)

// Get all doctor upcoming appointments
router.get('/upcomingAppointments', authenticateToken, getUpcomingAppointments)

// Get all doctor past appointments
router.get('/pastAppointments', authenticateToken, getPastAppointments)

router.get('/getPastAppointmentsFollowUp', authenticateToken, getPastAppointmentsFollowUp)

// Doctor schedules a follow up with a patient.
router.post('/scheduleFollowUp', scheduleFollowUpAppointment)

// Doctor views the requested scheduled follow ups.
router.get('/FollowUpRequested', authenticateToken, getScheduledFollowUp)

// Reschedule an appointment
router.post('/rescheduleAppointment', rescheduleAppointment)

// Cancel an appointment
router.post('/cancelAppointment', cancelAppointment);

module.exports = router;