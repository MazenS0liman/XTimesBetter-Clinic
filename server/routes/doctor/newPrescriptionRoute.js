const express = require('express')
const {
    getMyPatientsCompleted, getAllMedicines, addMedToPrescription, viewPrescription, savePrescription, getPatientDetails
} = require('../../controllers/doctor/newPrescriptionController');

const { authenticateToken } = require('../../middleware/authenticateToken');

const router = express.Router()


// GET all my patients with complete appointment
router.get('/myPatients', authenticateToken, getMyPatientsCompleted)
//router.get('/myPatients', getMyPatientsCompleted) //for testing
//GET all medicines
router.get('/medicines', getAllMedicines)

//Add medicine (name,dose,notes) to prescription
router.post('/addMed', addMedToPrescription)

//view prescription
router.get('/viewPrescription', viewPrescription)

//save prescription
router.post('/saveNewPrescription', authenticateToken, savePrescription)
//router.post('/saveNewPrescription', savePrescription) //for testing

//get more info
router.get('/getInfo/:patientUsername', getPatientDetails);


module.exports = router