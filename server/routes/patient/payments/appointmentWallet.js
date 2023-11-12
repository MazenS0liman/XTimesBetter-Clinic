const router = require('express').Router();
const { payAppointment } = require('../../../controllers/patient/payments/appointmentWalletController');

router.post('/', payAppointment);


module.exports = router;