var router = require('express').Router();
const { viewFamilyMembers, viewLinkedFamilyMembers, viewUnlinkedFamilyMembers } = require('../../controllers/patient/viewFamilyMembersController');
const { authenticateToken } = require('../../middleware/authenticateToken');

router.get('/', viewFamilyMembers);

router.get('/LinkedFamilyMembers', authenticateToken, viewLinkedFamilyMembers)

router.get('/UnlinkedFamilyMembers', authenticateToken, viewUnlinkedFamilyMembers)

module.exports = router;