var router = require('express').Router();
const { viewWalletNumber } = require('../../controllers/patient/viewPatientWalletController');

router.get('/', viewWalletNumber);

module.exports = router;