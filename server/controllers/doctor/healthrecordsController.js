const express = require('express');
const multer = require('multer');
const path = require('path');
const patientModel = require('../../models/Patient');
const AppointmentModel = require('../../models/Appointment');
const asyncHandler = require('express-async-handler');
const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      // Set the directory where uploaded files will be stored
      cb(null, '../server/uploads/');
    },
    filename: function (req, file, cb) {
      // Set the file name for the uploaded file
      cb(null, file.fieldname + '-' + Date.now() + '.' + file.originalname.split('.').pop());
    },
  });

  const uploadHealthRecord = asyncHandler(async (req, res) => {
    const username = req.params.user;
    const doctorusername=req.body.username; // Retrieve the username from query parameters
    //console.log(doctorusername);
    console.log(`Patient Username: ${username}`);
    console.log(`Doctor Username: ${doctorusername}`);
    console.log(req);
    console.log(req.files);
    try {
      // Use multer to handle file uploads
      const uploadMiddleware = multer({ storage: storage, fileFilter: fileFilter }).fields([
        { name: 'healthRecords', maxCount: 1 }
      ]);
  
      // Handle file uploads
      uploadMiddleware(req, res, async (err) => {
        if (err) {
          console.error('Error during file upload:', err);
          return res.status(500).json({ message: 'Error during file upload', error: err.message, success: false });
        }
  
        // Your validation and registration logic here
        const patient = req.body;
        const myPatients = await AppointmentModel.distinct('patient_username', { doctor_username: doctorusername, status: 'completed' });
        const isFound= myPatients.includes(username);
        console.log({username});
        const existingPatient = await patientModel.findOne({ username: patient.username });
        if (!existingPatient|| !isFound) {
          console.error('Patient not found');
          return res.status(400).json({ message: 'Patient not found', success: false });
        } else {
          const healthRecordsFile = req.files['healthRecords'][0];
          if (!healthRecordsFile) {
            console.error('Health Records file upload failed: File not received.');
            return res.status(400).json({ message: 'Health Records file upload failed: File not received.', success: false });
          }
          /*patient.healthRecords = {
            name: healthRecordsFile.fieldname,
            //path: healthRecordsFile.path,
            //contentType: healthRecordsFile.mimetype,
          };*/
          //patient.healthRecords =  healthRecordsFile.fieldname;
          //const newHealthRecords = req.body.healthRecords; // Array of dates
  
          //const updatedPatient = await patientModel.findOne({ username: patient.username });
          //const healthRecordsFilePath = healthRecordsFile.fieldname;
          console.log(existingPatient);

//const updatedPatient = await patientModel.findOne({ username: patient.username});
      existingPatient.healthRecords =[...existingPatient.healthRecords, healthRecordsFile.filename];
      const newPatient = await existingPatient.save();

          console.log(newPatient);
          
          res.status(200).json({ message: 'Health Records added successfully', registeredIn: true });
        }
      });
    } catch (error) {
      console.error('Error occurred during National ID upload:', error);
      return res.status(500).json({ message: 'Error occurred during National ID upload', error: error.message, success: false });
    }
  });
  
  const fileFilter = function (req, file, cb) {
    const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
  
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'), false);
    }
  };
  
  //module.exports = { uploadHealthRecord, fileFilter };
  const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
  });

  module.exports = {uploadHealthRecord, upload};

