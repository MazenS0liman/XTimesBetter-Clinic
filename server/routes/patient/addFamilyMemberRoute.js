var router = require('express').Router();
const { addFamilyMember } = require('../../controllers/patient/addFamilyMemberController');

router.post('/', addFamilyMember);

module.exports = router;