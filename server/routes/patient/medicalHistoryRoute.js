var router = require('express').Router();
const {viewMedicalHistory, addFile , deleteFile} = require('../../controllers/patient/viewMedicalHistory');

// APIs
router.post('/', addFile);
router.get('/', viewMedicalHistory);
router.get('/delete/:path', deleteFile);

module.exports = router;