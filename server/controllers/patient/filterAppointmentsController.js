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

const filterAppointmentsByDateForPatient = async (req, res) => {
    try {
        const entereddate = req.query.date
        //console.log(entereddate)
        const appointments = req.body
        //console.log("app" , appointments)
        const appointmentsMade = await appointmentsModel.find({patient_username : appointments.username, date: entereddate })
        /*  if (appointmentsMade.length === 0) {
              return res.status(200).json({ message: "No appointments found for the entered date" });
          }*/

        res.status(200).json(appointmentsMade);
    }
    catch (error) {
        res.status(500).json({ error: "Error filtering appointments by date" });
    }

}
const filterAppointmentsByStatusForPatient = async (req, res) => {
    try {
        const enteredstatus = req.query.status
        console.log("Status",enteredstatus)

        const appointments = req.body
        console.log("app" , appointments)

        const appointmentsFilteredByStatus = await appointmentsModel.find({patient_username:appointments.username, status: enteredstatus })
        /* if (appointmentsFilteredByStatus.length === 0) {
             return res.status(200).json({ message: "No appointments found for the entered status" });
         }*/

        res.status(200).json(appointmentsFilteredByStatus);
    }
    catch (error) {
        res.status(500).json({ error: "Error filtering appointments by status" });
    }

}


module.exports = { viewAppoinntments, filterAppointmentsByDateForPatient, filterAppointmentsByStatusForPatient };
//module.exports = { filterAppointmentsByDateForPatient };

/*var appoinntmentsarray = [appointmentsModel];
const dummyAppointment1 = { patient_username: "Nayera", doctor_username: "Tarek", date: "11/11/2023", status: "upcoming", time: "09/10/2023" };
const dummyAppointment2 = { patient_username: "Ahmed", doctor_username: "Essam", date: "12/11/2022", status: "completed", time: "09/10/2023" };
const dummyAppointment3 = { patient_username: "Mariam", doctor_username: "Sherif", date: "13/11/2023", status: "canceled", time: "09/10/2023" };
const dummyAppointment4 = { patient_username: "Mai", doctor_username: "Mohamed", date: "11/05/2023", status: "reschedule", time: "09/10/2023" };
const dummyAppointment5 = { patient_username: "Hesham", doctor_username: "Khaled", date: "11/07/2023", status: "upcoming", time: "09/10/2023" };
const dummyAppointment6 = { patient_username: "Salma", doctor_username: "Karim", date: "11/10/2020", status: "completed", time: "09/10/2023" };
const dummyAppointment7 = { patient_username: "Sarah", doctor_username: "Karim", date: "30/11/2023", status: "canceled", time: "09/10/2023" };

appoinntmentsarray.push(dummyAppointment1);
appoinntmentsarray.push(dummyAppointment2);
appoinntmentsarray.push(dummyAppointment3);
appoinntmentsarray.push(dummyAppointment4);
appoinntmentsarray.push(dummyAppointment5);
appoinntmentsarray.push(dummyAppointment6);
appoinntmentsarray.push(dummyAppointment7);*/
/*const filterAppointmentsByDate = async (req, res) => {
    try {
        const date = req.query.date; // assuming the expected date is provided in the request query parameter "date"
        const filteredAppointments = appoinntmentsarray.filter(Appointment => Appointment.date === date);
        res.status(200).json(filteredAppointments);
    } catch (error) {
        res.status(500).json({ error: "Error filtering appointments by date" });
    }
}*/
