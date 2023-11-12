const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');
const doctorModel = require('../../models/Doctor');
const patientModel = require('../../models/Patient');
const appointmentModel = require('../../models/Appointment');
 
const getPatients = asyncHandler( async (req, res) => {
    // Check if the doctor username is provided
    if (req.query.doctor_username === undefined) {
        return res.status(400).json({ message: 'Please add a doctor username!' });
    }

    const doctor = await doctorModel.findOne({ username: req.query.doctor_username });
    if (!doctor) {
        return res.status(404).json({ message: 'Doctor not found!' });
    }

    // Get all appointments with the doctor specified in the request
    const appointments = await appointmentModel.find({ doctor_username: req.query.doctor_username });

    // Get all patients of the doctor
    const patients = await patientModel.find({ username: { $in: appointments.map(appointment => appointment.patient_username) } });

    // Add appointments to the patient
    let modifiedPatients = [...patients];
    for (let i = 0; i < modifiedPatients.length; i++) {
        let filteredAppointments = appointments.filter(appointment => appointment.patient_username === modifiedPatients[i].username);
        modifiedPatients[i]._doc.appointments= filteredAppointments;
    }

    res.status(200).json({ message: 'Success', patients: modifiedPatients });
});



module.exports = { getPatients };