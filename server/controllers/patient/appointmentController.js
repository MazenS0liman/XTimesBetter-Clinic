const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');
const patientModel = require('../../models/Patient');
const doctorModel = require('../../models/Doctor');
const appointmentModel = require('../../models/Appointment');

// Add a new appointment to the database
const createAppointment = asyncHandler( async (req, res) => {
    const appointment = req.body;

    if (appointment.doctor_username === undefined) {
        res.status(400).json({ message: 'Please add a doctor username', createdAppointment: false });
    }

    if (appointment.patient_username === undefined) {
        res.status(400).json({ message: 'Please add a patient username', createAppointment: false });
    }

    if (appointment.date === undefined) {
        res.status(400).json({ message: 'Please add an appointment date', createAppointment: false });
    }

    const doctor = doctorModel.find({ username: appointment.doctor_username });
    const patient = patientModel.find({ username: appointment.patient_username });
    const appointmentDate = new Date(appointment.date);
    const currentDate = new Date().toLocaleDateString('en-GB');

    // Check if doctor is found in database
    if (!doctor) {
        res.status(400).json({ message: 'Doctor not found', createdAppointment: false });
    }

    // Check if patient is found in database
    if (!patient) {
        res.status(400).json({ message: 'Patient not found', createdAppointment: false });
    }

    // Check if the appointment date is in the past
    if (appointmentDate < currentDate) {
        res.status(400).json({ message: 'Appointment date is in the past', createdAppointment: false });
    }

    appointment.status = "upcoming";
    const newAppointment = await appointmentModel.create(appointment);
    res.status(200).json({ message: 'Success', appointment: newAppointment, createdAppointment: true });
});

// Get all appointments
const getAppointments = asyncHandler( async (req, res) => {
    const appointments = await appointmentModel.find({});
    res.status(200).json(appointments);
});


module.exports = {createAppointment, getAppointments};