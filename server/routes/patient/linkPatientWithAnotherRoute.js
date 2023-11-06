var router = require('express').Router();
const { linkFamilyMemberByEmail, linkFamilyMemberByMobile } = require('../../controllers/patient/linkPatientWithAnotherController');

router.post('/linkByEmail', linkFamilyMemberByEmail);
router.post('/linkByMobile', linkFamilyMemberByMobile);


module.exports = router;