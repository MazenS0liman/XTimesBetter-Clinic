var router = require('express').Router();
const { viewAppoinntments, filterAppointmentsByDateForPatient, filterAppointmentsByStatusForPatient } = require('../../controllers/patient/filterAppointmentsController');

router.get('/view', viewAppoinntments);
router.get('/filter', filterAppointmentsByDateForPatient);
router.get('/filterByStatus', filterAppointmentsByStatusForPatient);
module.exports = router;