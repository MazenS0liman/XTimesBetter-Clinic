var router = require('express').Router();
const { viewAppoinntments, filterAppointmentsByDateForPatient, filterAppointmentsByStatusForPatient } = require('../../controllers/patient/filterAppointmentsController');
const { authenticateToken } = require('../../middleware/authenticateToken');

router.get('/view', authenticateToken, viewAppoinntments);
router.get('/filter',authenticateToken, filterAppointmentsByDateForPatient);
router.get('/filterByStatus', authenticateToken, filterAppointmentsByStatusForPatient);
module.exports = router;