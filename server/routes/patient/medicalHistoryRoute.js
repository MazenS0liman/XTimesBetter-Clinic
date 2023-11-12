var router = require('express').Router();
const {viewMedicalHistory, addFile , deleteFile} = require('../../controllers/patient/viewMedicalHistory');
const { authenticateToken } = require('../../middleware/authenticateToken');

// APIs
router.post('/', authenticateToken, addFile);
router.get('/', authenticateToken, viewMedicalHistory);
router.get('/delete/:path', authenticateToken, deleteFile);

module.exports = router;