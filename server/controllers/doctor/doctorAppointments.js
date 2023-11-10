const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');
const appointmentModel = require('../../models/Appointment.js');
const doctorModel = require('../../models/Doctor.js')

const viewAppointments = async (req, res) => {
    try {
        const appointments = await appointmentModel.find();
        res.status(200).json(appointments);
    } catch (error) {
        res.status(500).json({ error: "Can't get your appoinntments" });
    }
}

const getUpcomingAppointments = asyncHandler( async (req, res) => 
{
    const doctor = await doctorModel.findOne({
        username: req.query.doctor_username,
    });
    if (!doctor) {
        return res.status(404).json('ss');
    }
    const upcomingAppointments = await appointmentModel.find({doctor_username: doctor.username , status:"upcoming"});
    res.status(200).json(upcomingAppointments);
});

const getPastAppointments = asyncHandler( async (req, res) => 
{
    const doctor = await doctorModel.findOne({
        username: req.query.doctor_username,
    });
    if (!doctor) {
        return res.status(404).json('ss');
    }
    const upcomingAppointments = await appointmentModel.find({doctor_username: doctor.username , status:"completed"});
    res.status(200).json(upcomingAppointments);
});

const scheduleFollowUpAppointment = asyncHandler(async (req, res) => {
    try {
      const { patientUsername, doctorUsername, date, time } = req.body;
  
      // Validate input (add more validation if needed)
  
      // Check if the doctor exists
      const doctor = await doctorModel.findOne({ username: doctorUsername });
      if (!doctor) {
        return res.status(400).json({ message: 'Doctor not found' });
      }
  
      // Check if the patient already has an appointment at the specified time
      const existingAppointment = await appointmentModel.findOne({
        patient_username: patientUsername,
        date,
        time,
      });
  
      if (existingAppointment) {
        return res.status(400).json({ message: 'Patient already has an appointment at this time' });
      }
  
      // Create a new follow-up appointment
      const newFollowUpAppointment = new appointmentModel({
        doctor_username: doctorUsername,
        patient_username: patientUsername,
        date,
        time,
        status: 'upcoming',
      });
  
      // Save the appointment
      await newFollowUpAppointment.save();
  
      // Optionally, update the doctor's available time slots, if needed
  
      return res.status(201).json({ message: 'Follow-up appointment scheduled successfully', appointment: newFollowUpAppointment });
    } catch (error) {
      console.error('Error scheduling follow-up appointment:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  
  

module.exports = {getUpcomingAppointments , getPastAppointments, scheduleFollowUpAppointment};