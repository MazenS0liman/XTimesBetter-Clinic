var router = require('express').Router();
const { viewFamilyMembers } = require('../../controllers/patient/viewFamilyMembersController');

router.get('/', viewFamilyMembers);

module.exports = router;