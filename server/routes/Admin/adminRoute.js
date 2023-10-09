var router = require('express').Router();
const {addAdmin,removeAdmin, getAdmins, removePatient, removeDoctor } = require('../../controllers/Admin/admincontroller.js');

// const { removePharmacist } = require('../../controllers/pharmacist/pharmacistcontroller.js');
// const {removePatient} = require('../../controllers/patient/patientcontroller.js');

// APIs
router.delete('/', removePatient);

// APIs
router.delete('/', removeDoctor);

// APIs
router.post('/', addAdmin);
router.delete('/', removeAdmin);
router.get('/', getAdmins);

module.exports = router;
