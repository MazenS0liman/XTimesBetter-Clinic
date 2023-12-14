var router = require('express').Router();
const { addFamilyMember } = require('../../controllers/patient/addFamilyMemberController');
const { authenticateToken } = require('../../middleware/authenticateToken');


router.post('/', authenticateToken, addFamilyMember);

module.exports = router;