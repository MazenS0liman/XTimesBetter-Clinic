var router = require('express').Router();
const { viewContract, addContract, viewDoctors, acceptContract } = require('../../controllers/doctor/viewContractController');
const { authenticateToken } = require('../../middleware/authenticateToken');

router.get('/viewContract', authenticateToken, viewContract);
router.post('/addContract', authenticateToken, addContract);
router.get('/viewDoctors', authenticateToken, viewDoctors);
router.get('/acceptContract', authenticateToken, acceptContract);

module.exports = router;