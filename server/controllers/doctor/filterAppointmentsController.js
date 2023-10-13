const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');
const appointmentsModel = require('../../models/Appointment.js');

const viewAppoinntments = async (req, res) => {
    try {
        const appointments = await appointmentsModel.find();
        res.status(200).json(appointments);
    } catch (error) {
        res.status(500).json({ error: "Can't get your appoinntments" });
    }

}
const filterAppointmentsByDateForDoctor = async (req, res) => {
    try {
        const entereddate = req.query.date
        const appointmentsMade = await appointmentsModel.find({ date: entereddate })
        /* if (appointmentsMade.length === 0) {
             return res.status(200).json({ message: "No appointments found for the entered date" });
         }*/

        res.status(200).json(appointmentsMade);
    }
    catch (error) {
        res.status(500).json({ error: "Error filtering appointments by date" });
    }

}
const filterAppointmentsByStatusForDoctor = async (req, res) => {
    try {
        const enteredstatus = req.query.status
        const appointmentsFilteredByStatus = await appointmentsModel.find({ status: enteredstatus })
        /* if (appointmentsFilteredByStatus.length === 0) {
             return res.status(200).json({ message: "No appointments found for the entered status" });
         }*/

        res.status(200).json(appointmentsFilteredByStatus);
    }
    catch (error) {
        res.status(500).json({ error: "Error filtering appointments by status" });
    }

}
module.exports = { viewAppoinntments, filterAppointmentsByDateForDoctor, filterAppointmentsByStatusForDoctor };    