const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const patientModel = require('../../models/Patient');
const multer = require('multer');

const fs = require('fs');

const viewMedicalHistory = async (req, res) => {
    //console.log('View Medical Records route hit');

  const myUsername = req.body.username;
  try {
    // Find the patient by username
    const patient = await patientModel.findOne({ username: myUsername });

    // Check if the patient exists
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Get the health records array
    const medicalHistoryRecords = patient.medicalHistory;

    // Check if there are health records
    if (!medicalHistoryRecords ) {
      return res.status(404).json({ message: 'No health records found for the patient' });
    }

    // Send the health records array to the client
    res.status(200).json({ medicalHistoryRecords });
  } catch (error) {
    console.error('Error retrieving health records:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const deleteFile = asyncHandler(async (req, res) =>{
    //console.log('DELETEE Medical Records route hit');

    const medicalHistoryPath = req.params.path;

    //console.log(medicalHistoryPath);
    const myUsername = req.body.username;
    try {
        const patient = await patientModel.findOne({username: myUsername});

        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }

        patient.medicalHistory = patient.medicalHistory.filter(path => path!= medicalHistoryPath );

        const newPatient = await patientModel.findOneAndUpdate( {username : myUsername }, { medicalHistory: patient.medicalHistory }, { new: true });

        return res.status(200).json({ message: 'Medical History File is deleted successfully', newPatient });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'An error occurred while deleting history' });
    }
});

const addFile = asyncHandler(async (req, res) =>{
    const myUsername = req.body.username;
    console.log(myUsername);
    try{
        //console.log("ADD FILE HIT");
        // Use multer to handle file uploads
        const uploadMiddleware = multer({ storage: storage, fileFilter: fileFilter }).fields([
            { name: 'medicalHistoryUpload', maxCount: 1 },
        ]);
        // Handle file uploads
        uploadMiddleware(req, res, async (err) => {
            if (err) {
                console.error('Error during file upload:', err);
                return res.status(500).json({ message: 'Error during file upload', error: err.message, success: false });
            }
            const medicalHistoryUploadFile = req.files['medicalHistoryUpload'][0];
            if (!medicalHistoryUploadFile) {
                console.error('Medical History file upload failed: File not received.');
                return res.status(400).json({ message: 'Medical History file upload failed: File not received.', success: false });
            }
            //CHANGE BY TOKEN
            /* const myUsername = req.body.username;
            console.log(myUsername); */
            try {
                const patient = await patientModel.findOne({username: myUsername});
        
                if (!patient) {
                    return res.status(404).json({ message: 'Patient not found' });
                }
        
                patient.medicalHistory = [...patient.medicalHistory,  medicalHistoryUploadFile.filename ];
        
                const updatedPatient = await patientModel.findOneAndUpdate( {username : myUsername }, { medicalHistory: patient.medicalHistory }, { new: true });
        
                return res.status(200).json({ message: 'Medical History File is deleted successfully', updatedPatient });
            } catch (error) {
                console.error('Error:', error);
                res.status(500).json({ message: 'An error occurred while deleting history' });
            }

        });

    }catch(error){
        console.error('Error occurred during upload:', error);
        return res.status(500).json({ message: 'Error occurred during upload', error: error.message, success: false });
    }
});

//files
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

// Filter file types (e.g., only accept images)

  const fileFilter = function (req, file, cb) {
    const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
  
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'), false);
    }
  };

  const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
  });


// Export the router
module.exports = {viewMedicalHistory, deleteFile, addFile}