var router = require('express').Router();
const { getUpcomingAppointments , getPastAppointments, scheduleFollowUpAppointment } = require('../../controllers/doctor/doctorAppointments')

// Get all doctor upcoming appointments
router.get('/upcomingAppointments', getUpcomingAppointments)

// Get all doctor past appointments
router.get('/pastAppointments', getPastAppointments)

// Doctor schedules a follow up with a patient.
router.post('/scheduleFollowUp', scheduleFollowUpAppointment)

module.exports = router;