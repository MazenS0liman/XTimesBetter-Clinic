var router = require('express').Router();
const { createDoctor, getDoctors, getDoctorRequests } = require('../../controllers/doctor/registerationController');

// APIs

router.post('/',createDoctor);
router.get('/', getDoctors);
router.get('/requests' , getDoctorRequests);

module.exports = router;