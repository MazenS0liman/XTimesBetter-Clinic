const express = require('express');
const router = express.Router();
const patientModel = require('../../models/Patient');
const fs = require('fs');

const viewHealthRecords = async (req, res) => {
  const myUsername = req.body.username;
  try {
    // Find the patient by username
    const patient = await patientModel.findOne({ username: myUsername });

    // Check if the patient exists
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Get the health records array
    const healthRecords = patient.healthRecords;

    // Check if there are health records
    if (!healthRecords || healthRecords.length === 0) {
      return res.status(404).json({ message: 'No health records found for the patient' });
    }

    // Send the health records array to the client
    res.status(200).json({ healthRecords });
  } catch (error) {
    console.error('Error retrieving health records:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Add the route to the router
//router.get('/viewHealthRecords', viewHealthRecords);

// Export the router
module.exports = {viewHealthRecords}