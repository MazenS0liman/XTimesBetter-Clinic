var router = require('express').Router();
const { addAdmin, removeAdmin, getAdmins, removePatient, removeDoctor } = require('../../controllers/admin/admincontroller.js');

// const { removePharmacist } = require('../../controllers/pharmacist/pharmacistcontroller.js');
// const {removePatient} = require('../../controllers/patient/patientcontroller.js');

// APIs
router.delete('/removepatient', removePatient);

// APIs
router.delete('/removedoctor', removeDoctor);

// APIs
router.post('/', addAdmin);
router.delete('/removeadmin', removeAdmin);
router.get('/', getAdmins);

module.exports = router;
