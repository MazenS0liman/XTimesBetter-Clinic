var router = require('express').Router();
const { viewAppoinntments, filterAppointmentsByDateForDoctor, filterAppointmentsByStatusForDoctor } = require('../../controllers/doctor/filterAppointmentsController');

router.get('/view', viewAppoinntments);
router.get('/filter', filterAppointmentsByDateForDoctor);
router.get('/filterByStatus', filterAppointmentsByStatusForDoctor);
module.exports = router;