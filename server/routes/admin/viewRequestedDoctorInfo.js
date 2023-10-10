const router = require('express').Router();
const { viewReqDoctorInfo } = require('../../controllers/admin/viewReqDoctorInfo');

router.get('/', viewReqDoctorInfo);


module.exports = router;