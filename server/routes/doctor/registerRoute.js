var router = require('express').Router();
const { createDoctor, getDoctors } = require('../../controllers/doctor/registerationController');

// APIs
router.post('/', createDoctor);
router.get('/', getDoctors);

module.exports = router;