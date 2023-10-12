var router = require('express').Router();
const { getDoctors } = require('../../controllers/patient/ViewDoctorsController');

// APIs
router.get('/', getDoctors);

module.exports = router;