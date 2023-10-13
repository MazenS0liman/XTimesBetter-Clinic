const router = require('express').Router();
const { viewReqDoctorsInfo } = require('../../controllers/admin/viewReqDoctorsInfo');

router.get('/', viewReqDoctorsInfo);


module.exports = router;