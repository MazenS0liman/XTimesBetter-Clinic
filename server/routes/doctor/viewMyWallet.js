const router = require('express').Router();
const { viewDoctorWalletNumber } = require("../../controllers/doctor/viewDoctorWalletController");
const { authenticateToken } = require('../../middleware/authenticateToken');

router.get('/', authenticateToken, viewDoctorWalletNumber);

module.exports = router;