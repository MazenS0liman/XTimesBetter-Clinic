const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');
const patientModel = require('../../models/Patient');
const doctorModel = require('../../models/Doctor');
const appointmentModel = require('../../models/Appointment');

// Add a new appointment to the database
const createAppointment = asyncHandler(async (req, res) => {
    const appointment = req.body;

    if (appointment.doctor_username === undefined || appointment.patient_username === undefined || appointment.date === undefined || appointment.time == undefined
        || appointment.name == undefined || appointment.price == undefined || appointment.booked_by == undefined) {
        res.status(400).json({ message: 'Please provide doctor username, patient username, and appointment date', createdAppointment: false });
        return;
    }

    const doctor = await doctorModel.findOne({ username: appointment.doctor_username });
    const patient = await patientModel.findOne({ username: appointment.patient_username });

    if (!doctor) {
        res.status(400).json({ message: 'Doctor not found', createdAppointment: false });
        return;
    }
    
    /*
    if (!patient) {
        res.status(400).json({ message: 'Patient not found', createdAppointment: false });
        return;
    }
    */

    const appointmentDate = new Date(appointment.date);
    const currentDate = new Date().toLocaleDateString('en-GB');

    if (appointmentDate < currentDate) {
        res.status(400).json({ message: 'Appointment date is in the past', createdAppointment: false });
        return;
    }

    appointment.status = "upcoming";
    
    const newAppointment = await appointmentModel.create(appointment);

    console.log(typeof appointment.time);
    console.log('Appointment time', appointment.time);

    console.log('Available Time Slots Before:', doctor.availableTimeSlots);

    const appointmentTimeAsString = new Date(appointment.time).toISOString();

    const remainingTimeSlots = doctor.availableTimeSlots.filter(slot => {
        const slotAsString = new Date(slot).toISOString();
        return slotAsString !== appointmentTimeAsString;
    });

    console.log('Available Time Slots After:', remainingTimeSlots);

    doctor.availableTimeSlots = remainingTimeSlots;

    //console.log(doctor.availableTimeSlots)
    await doctor.save();
    
    res.status(200).json({ message: 'Success', appointment: newAppointment, createdAppointment: true });
});


// Get Upcoming appointments
const getUpcomingAppointments = asyncHandler( async (req, res) => 
{
    const patient = await patientModel.findOne({
        username: req.body.username,
    });
    if (!patient) {
        return res.status(404).json('No');
    }
    const upcomingAppointments = await appointmentModel.find({patient_username: patient.username , status:"upcoming"});
    res.status(200).json(upcomingAppointments);
});

// Get Completed (Past) Appointments 
const getPastAppointments = asyncHandler( async (req, res) => 
{
    const patient = await patientModel.findOne({
        username: req.body.username,
    });
    if (!patient) {
        return res.status(404).json('No');
    }
    const upcomingAppointments = await appointmentModel.find({patient_username: patient.username , status:"completed"});
    res.status(200).json(upcomingAppointments);
});

// Get all appointments
const getAppointments = asyncHandler( async (req, res) => {
    const appointments = await appointmentModel.find({});
    res.status(200).json(appointments);
});


module.exports = {createAppointment, getAppointments, getUpcomingAppointments, getPastAppointments};