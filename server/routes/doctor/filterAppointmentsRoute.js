var router = require('express').Router();
const { viewAppoinntments, filterAppointmentsByDateForDoctor, filterAppointmentsByStatusForDoctor } = require('../../controllers/doctor/filterAppointmentsController');
const { authenticateToken } = require('../../middleware/authenticateToken');

router.get('/view', viewAppoinntments);
router.get('/filter',authenticateToken, filterAppointmentsByDateForDoctor);
router.get('/filterByStatus', authenticateToken, filterAppointmentsByStatusForDoctor);
module.exports = router;