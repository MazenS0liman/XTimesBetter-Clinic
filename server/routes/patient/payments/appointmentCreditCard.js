const router = require('express').Router();
const { payAppointment } = require('../../../controllers/patient/payments/appointmentCreditCardController');

router.post('/', payAppointment);


module.exports = router;