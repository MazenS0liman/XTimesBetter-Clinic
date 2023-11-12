const express = require('express');
const router = express.Router();
const patientModel = require('../../models/Patient');
const fs = require('fs');
const AppointmentModel = require('../../models/Appointment');

// const getCompletedPatientUsernames = async () => {
//   try {
//       // Find completed appointments with doctor_username "Ahmed"
//       const completedAppointments = await appointmentModel.find({
//           doctor_username: "Ahmed",
//           status: "completed"
//       });

//       // Extract patient usernames from completed appointments
//       const completedPatientUsernames = completedAppointments.map(appointment => appointment.patient_username);

//       //console.log("Completed Patient Usernames:", completedPatientUsernames);
//       return completedPatientUsernames;
//   } catch (error) {
//       console.error("Error:", error);
//       return [];
//   }
// };

// Example usage
//getCompletedPatientUsernames();

const viewPHealthRecords = async (req, res) => {
    //console.log(req.query);
    const username = req.params.user;
    const doctorusername="Logy"; // Retrieve the username from query parameters
    const myPatients = await AppointmentModel.distinct('patient_username', { doctor_username: doctorusername, status: 'completed' });
    const isFound= myPatients.includes(username);
    console.log({username});
    try {
      const existingPatient = await patientModel.findOne({ username });
  
      if (!existingPatient || !isFound) {
        return res.status(404).json({ message: 'Patient not found' });
      }
  
      const healthRecords = existingPatient.healthRecords;
  
      if (!healthRecords || healthRecords.length === 0) {
        return res.status(404).json({ message: 'No health records found for the patient' });
      }
  
      res.status(200).json({ healthRecords });
    } catch (error) {
      console.error('Error retrieving health records:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  // Add the route to the router
  // router.get('/viewHealthRecords', viewHealthRecords);
  
  // Export the router
  module.exports = {viewPHealthRecords};