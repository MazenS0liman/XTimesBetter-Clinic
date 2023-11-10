var router = require('express').Router();
const { viewFamilyMembers, viewLinkedFamilyMembers, viewUnlinkedFamilyMembers } = require('../../controllers/patient/viewFamilyMembersController');

router.get('/', viewFamilyMembers);

router.get('/LinkedFamilyMembers', viewLinkedFamilyMembers)

router.get('/UnlinkedFamilyMembers', viewUnlinkedFamilyMembers)

module.exports = router;