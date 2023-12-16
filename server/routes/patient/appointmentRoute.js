var router = require('express').Router();
const { createAppointment, getAppointments, getUpcomingAppointments, getPastAppointments, getHourlyRateByUsername, getHourlyRateByNationalID, getBookedAppointments, rescheduleAppointment, cancelAppointment, getAppointmentById, getPatientByUsername, getFollowUpAppointments } = require('../../controllers/patient/appointmentController');
const { authenticateToken } = require('../../middleware/authenticateToken');

// APIs
router.post('/createAppointment', createAppointment);


router.get('/getAppointments', authenticateToken, getAppointments);


router.get('/getFollowUpAppointments',authenticateToken,getFollowUpAppointments);
// Get all upcoming appointments.
router.get('/upcomingAppointments', authenticateToken, getUpcomingAppointments);

// Get all past appointments.
router.get('/pastAppointments', authenticateToken, getPastAppointments);

// Get patient name by patient username.
router.get('/getPatientByUsername', getPatientByUsername);

//Get Hourly Rate By Patient Username
router.get('/getHourlyRateByUsername', getHourlyRateByUsername);

//Get Hourly Rate By Patient Username
router.get('/getHourlyRateByNationalID', getHourlyRateByNationalID);

// Get all appointments booked by me 
router.get('/bookedAppointments', authenticateToken, getBookedAppointments);

// Reschedule Appointments
router.post('/rescheduleAppointment', authenticateToken, rescheduleAppointment);

// Cancelling an appointment
router.post('/cancelAppointment', authenticateToken,cancelAppointment)

// Get appointment by ID
router.get('/getAppointmentByID', authenticateToken, getAppointmentById);

module.exports = router;