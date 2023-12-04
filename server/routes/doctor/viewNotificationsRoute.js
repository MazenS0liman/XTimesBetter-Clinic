const router = require('express').Router();
const { getDoctorNotifications } = require('../../controllers/doctor/viewNotificationsController');

router.post('/', getDoctorNotifications);

module.exports = router;