var router = require('express').Router();
const { viewRequestedFollowUps, addAppointment, acceptFollowUp, rejectFollowUp, viewUnlinkedFamilyMembers } = require('../../controllers/doctor/acceptRejectFollowUpController');
const { authenticateToken } = require('../../middleware/authenticateToken');


router.get('/viewRequestedFollowUps', authenticateToken, viewRequestedFollowUps);
router.get('/UnlinkedFamilyMembers', authenticateToken, viewUnlinkedFamilyMembers);
router.post('/addAppointment', authenticateToken, addAppointment);
router.put('/acceptFollowUp', authenticateToken, acceptFollowUp);
router.put('/rejectFollowUp', authenticateToken, rejectFollowUp);

module.exports = router;