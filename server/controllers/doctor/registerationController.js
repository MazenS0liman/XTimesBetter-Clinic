const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');
const doctorModel = require('../../models/Doctor');
const doctorRequestsModel = require('../../models/DoctorRequests');
const PatientModel = require('../../models/Patient');
const multer = require('multer');
const fs = require('fs'); 

const bcrypt = require('bcrypt');

const createDoctor = asyncHandler(async (req, res) => {
    console.log(req.body);
    console.log(req.files);
    try {
        // Use multer to handle file uploads
        const uploadMiddleware = multer({ storage: storage, fileFilter: fileFilter }).fields([
            { name: 'nationalID', maxCount: 1 },
            { name: 'medicalLicense', maxCount: 1 },
            { name: 'medicalDegree', maxCount: 1 },
        ]);

        // Handle file uploads
        uploadMiddleware(req, res, async (err) => {
            if (err) {
                console.error('Error during file upload:', err);
                return res.status(500).json({ message: 'Error during file upload', error: err.message, success: false });
            }

            // Your validation and registration logic here
            const doctor = req.body;

    if (doctor.username === undefined) {
        return res.status(400).json({ message: 'Please add a username!', registeredIn: false });
    }

    if (doctor.name === undefined) {
        return res.status(400).json({ message: 'Please add a name!', registeredIn: false });
    }

    if (doctor.email === undefined) {
        return res.status(400).json({ message: 'Please add an email!', registeredIn: false });
    }

    if (doctor.password === undefined) {
        return res.status(400).json({ message: 'Please add a password!', registeredIn: false });
    }

    if (doctor.dob === undefined) {
        return res.status(400).json({ message: 'Please add a date of birth!', registeredIn: false });
    }

    if (doctor.hourly_rate === undefined) {
        return res.status(400).json({ message: 'Please add an hourly rate!', registeredIn: false });
    }

    if (doctor.affiliation === undefined) {
        return res.status(400).json({ message: 'Please add an affiliation!', registeredIn: false });
    }

    if (doctor.educational_background === undefined) {
        return res.status(400).json({ message: 'Please add an educational background', registeredIn: false });
    }

    if (doctor.speciality === undefined) {
        return res.status(400).json({ message: 'Please add a speciality', registeredIn: false });
    }

    // if (doctor.availableTimeSlots === undefined) {
    //     return res.status(400).json({ message: 'Please add available time slots', registeredIn: false });
    // }
    doctor.status = "onhold";
    let takenUsername = null;
    let takenEmail = null;
    let takenUsernameReq = null;
    let takenEmailReq = null;
    let takenUsernamePat = null;
    let takenEmailPat = null;

    takenUsername =  await doctorModel.findOne({ username: doctor.username });
    takenEmail = await doctorModel.findOne({ email: doctor.email });
    takenUsernameReq =  await doctorRequestsModel.findOne({ username: doctor.username });
    takenEmailReq = await doctorRequestsModel.findOne({ email: doctor.email });
    takenUsernamePat =  await PatientModel.findOne({ username: doctor.username });
    takenEmailPat = await PatientModel.findOne({ email: doctor.email });

    if (takenUsername || takenUsernameReq || takenUsernamePat) {
        return res.status(400).json({ message: 'Username already taken!', registeredIn: false });
    } else if (takenEmail || takenEmailReq || takenEmailPat) {
        return res.status(400).json({ message: 'Email already registered!', registeredIn: false });
    } else {
        console.log(doctor);
        console.log(req.files);
        // Generate a hashcode of doctor's password
        doctor.password = await bcrypt.hash(doctor.password, 10);
        //doctor.nationalID = doctor.nationalIDFile;
        //const newDoctorRequest = await doctorRequestsModel.create(doctor);

        //res.status(200).json({ message: 'Success', doctor: newDoctorRequest, registeredIn: true });
        
            // Associate uploaded file information with the doctor
            const nationalIDFile = req.files['nationalID'][0];
            const medicalLicenseFile = req.files['medicalLicense'][0];
            const medicalDegreeFile = req.files['medicalDegree'][0];

            // Check if the file was successfully uploaded
            if (!nationalIDFile) {
                console.error('National ID file upload failed: File not received.');
                return res.status(400).json({ message: 'National ID file upload failed: File not received.', success: false });
            }
            if (!medicalLicenseFile) {
                console.error('MedicalLicense file upload failed: File not received.');
                return res.status(400).json({ message: 'MedicalLicense file upload failed: File not received.', success: false });
            }if (!medicalDegreeFile) {
                console.error('Medical Degree file upload failed: File not received.');
                return res.status(400).json({ message: 'Medical Degree file upload failed: File not received.', success: false });
            }

            // Create the doctor object with file information
            
                doctor.nationalID=  {
                    name: nationalIDFile.filename,
                    path: nationalIDFile.path,
                    contentType: nationalIDFile.mimetype,
                };
                doctor.medicalLicense = {
                    name: medicalLicenseFile.filename,
                    path: medicalLicenseFile.path,
                    contentType: medicalLicenseFile.mimetype,
                };
                doctor.medicalDegree= {
                    name: medicalDegreeFile.filename,
                    path: medicalDegreeFile.path,
                    contentType: medicalDegreeFile.mimetype,
                };
                doctor.status=  "onhold";
                console.log(doctor);

            // Save the doctor request to the database
            const newDoctorRequest = await doctorRequestsModel.create(doctor);

            res.status(200).json({ message: 'Success', doctor: newDoctorRequest, registeredIn: true });
        }});
    } catch (error) {
        console.error('Error occurred during upload:', error);
        return res.status(500).json({ message: 'Error occurred during upload', error: error.message, success: false });
    }
});

// Retrieve all doctors from the database
 const getDoctors = asyncHandler(async (req, res) => {
    let doctors = await doctorModel.find();

    res.status(200).json(doctors);
});

// Retrieve all doctor requests from the database
const getDoctorRequests = asyncHandler(async (req, res) => {
    let doctorRequests = await doctorRequestsModel.find();
    res.status(200).json(doctorRequests);
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

module.exports = {createDoctor, getDoctors, getDoctorRequests, upload};
