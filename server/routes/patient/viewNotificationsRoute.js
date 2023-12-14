const router = require('express').Router();
const { getPatientNotifications } = require('../../controllers/patient/viewNotificationsController');

router.post('/', getPatientNotifications);

module.exports = router;