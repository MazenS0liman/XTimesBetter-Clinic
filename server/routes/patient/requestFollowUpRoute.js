var router = require('express').Router();
const { requestFollowUp, viewPastAppointmentWithoutFollowUp, getFollowUps } = require('../../controllers/patient/requestFollowUpController');
const { authenticateToken } = require('../../middleware/authenticateToken');


router.post('/requestFollowUp', authenticateToken, requestFollowUp);
router.get('/viewPastAppointment', authenticateToken, viewPastAppointmentWithoutFollowUp);
router.get('/getFollowUps', authenticateToken, getFollowUps);

module.exports = router;