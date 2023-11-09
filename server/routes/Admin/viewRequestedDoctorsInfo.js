const router = require('express').Router();
const { viewReqDoctorsInfo,acceptDoctor,rejectDoctor } = require('../../controllers/admin/viewReqDoctorsInfo');

router.get('/', viewReqDoctorsInfo);
router.get('/accept/:id', acceptDoctor);
router.get('/reject/:id', rejectDoctor);


module.exports = router;
