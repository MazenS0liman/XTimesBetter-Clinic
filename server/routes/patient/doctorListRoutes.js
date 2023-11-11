const express = require('express')

const {
    getDoctors,
    searchDoctorByName,
    searchDoctorBySpeciality,
    searchDoctorByNameandSpeciality,
    filterDoctorBySpeciality,
    filterDoctorByTime,
    selectedDoctorDetails,
    getAppointments,
    filterDoctorBySpecialityandTime,
    selectedDoctorAppointments,
    getDoctorsWithPackages
} = require('../../controllers/patient/doctorListController.js');

const router = express.Router();
const { authenticateToken } = require('../../middleware/authenticateToken');


// Get all doctors
router.get('/', getDoctors)

// Search a specific doctor by searching using doctor name
router.get('/name/:name',searchDoctorByName)

// Search a specific doctor by searching using doctor speciality
router.get('/speciality/:speciality', searchDoctorBySpeciality)

// Search a specific doctor by searching using doctor speciality
router.get('/name/:name/speciality/:speciality', searchDoctorByNameandSpeciality)

// Filter doctors by speciality
router.get('/filter/speciality/:speciality', filterDoctorBySpeciality)

// Filter doctors by time and date
router.get('/filter', filterDoctorByTime)

// Filter doctors by speciality , time and date.
router.get('/filterSpecialityandTime', filterDoctorBySpecialityandTime)

// Selected Doctor Details
router.get('/selected/:selectedDoctor', selectedDoctorDetails)

// Get all appointments
router.get('/appointments', getAppointments)

// Get selected doctor appointments
router.get('/DoctorAppointments', selectedDoctorAppointments)

// Get doctors along with package prices
router.get('/allDoctors', authenticateToken, getDoctorsWithPackages)

module.exports = router;    