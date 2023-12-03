var router = require('express').Router();
const {StartAppointment,AllApointnments} = require('../../controllers/doctor/DVideoCallController');
const { authenticateToken } = require('../../middleware/authenticateToken');

// APIs
router.get('/AllApointments', authenticateToken, AllApointnments);
router.post('/start',StartAppointment);

module.exports = router;