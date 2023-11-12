const router = require('express').Router();
const { payPackage } = require('../../../controllers/patient/payments/packageWalletPaymentController');

router.post('/', payPackage);


module.exports = router;