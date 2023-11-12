const router = require('express').Router();
const { payPackage } = require('../../../controllers/patient/payments/packageCreditCardPaymentController');

router.post('/', payPackage);


module.exports = router;