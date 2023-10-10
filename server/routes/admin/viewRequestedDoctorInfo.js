const router = require('express').Router();
const { viewReqDoctorInfo } = require('../../controllers/admin/viewReqDoctorInfo');
const { removeDoctor }=require('../../controllers/admin/removeDoctor');

router.get('/', viewReqDoctorInfo);
router.post('/',removeDoctor);

module.exports = router;