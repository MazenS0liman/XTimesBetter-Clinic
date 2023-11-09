var router = require('express').Router();
const { linkFamilyMemberByEmail, linkFamilyMemberByMobile } = require('../../controllers/patient/linkPatientWithAnotherController');
const { authenticateToken } = require('../../middleware/authenticateToken');

router.post('/linkByEmail', authenticateToken, linkFamilyMemberByEmail);
router.post('/linkByMobile', authenticateToken, linkFamilyMemberByMobile);


module.exports = router;