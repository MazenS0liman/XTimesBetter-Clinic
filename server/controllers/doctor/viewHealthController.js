const express = require('express');
const router = express.Router();
const patientModel = require('../../models/Patient');
const fs = require('fs');

const viewPHealthRecords = async (req, res) => {
    //console.log(req.query);
    const username = req.body.username; // Retrieve the username from query parameters
    console.log({username});
    try {
      const existingPatient = await patientModel.findOne({ username });
  
      if (!existingPatient) {
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