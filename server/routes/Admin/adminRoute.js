var router = require('express').Router();
const {addAdmin,removeAdmin, getAdmins, getDoctors,getPatients,removeDoctor,removePatient } = require('../../controllers/Admin/admincontroller.js');

// const { removePharmacist } = require('../../controllers/pharmacist/pharmacistcontroller.js');
// const {removePatient} = require('../../controllers/patient/patientcontroller.js');


// APIs
router.delete('/removePatient', removePatient);

// APIs
router.delete('/removeDoctor', removeDoctor);

// APIs
router.post('/', addAdmin);
router.delete('/removeAdmin/:adminUsername', removeAdmin);
router.get('/admin', getAdmins);
router.get('/get',getPatients);
router.get('/gett',getDoctors)

module.exports = router;