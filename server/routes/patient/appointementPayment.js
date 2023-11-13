const router= require('express').Router();
const {payAppointement}= require('../../controllers/patient/appointementPaymentController');


router.post('/', payAppointement);

module.exports = router;