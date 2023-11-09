var router = require('express').Router();
const { viewWalletNumber } = require('../../controllers/patient/viewPatientWalletController');
const { authenticateToken } = require('../../middleware/authenticateToken');

router.get('/', authenticateToken, viewWalletNumber);

module.exports = router;