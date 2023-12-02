const express = require('express');
const dotenv = require('dotenv').config();
const colors = require('colors');
const mongoose = require('mongoose');
const cors = require('cors');
var bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const adminRoutes = require('./routes/Admin/adminRoute.js');
const doctorRoutes = require('./routes/doctor/timeSlotsRoute.js');
const prescriptionRoutes = require('./routes/patient/prescriptions');
const prescriptionDoctorRoutes= require('./routes/doctor/prescriptionsDr');

const doctorListRoutes = require('./routes/patient/doctorListRoutes');
const multer = require('multer');
const path = require('path');
const updatePrescriptions = require('./routes/doctor/updatePrescriptionRoute.js')
mongoose.set('strictQuery', false);


// Express app
const app = express();

// App variables
const Port = process.env.PORT || 5000;
const MongoURI = process.env.MONGO_URI;

const corsOptions = {
  origin: '*',
  credentials: true,            //access-control-allow-credentials:true
  optionSuccessStatus: 200,
}

// Middleware
//app.use(express.json());
//app.use(express.urlencoded({ extended: true }));

// Increase payload size limit (e.g., 50MB)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use(cors(corsOptions))

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/uploads', express.static(__dirname + '/uploads'));


// Middleware for allowing react to fetch() from server
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, OPTIONS');
  next();
});


// Connect to MongoDB
mongoose.connect(MongoURI)
  .then(() => {
    console.log("MongoDB is now connected!")

    const allowedOrigins = ['http://localhost:5173'];
    // Set up CORS options.


    const corsOptions = {
      origin: (origin, callback) => {
        if (allowedOrigins.includes(origin) || !origin) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
    };

    // Enable CORS for all routes or specify it for specific routes.
    app.use(cors(corsOptions));

    // Starting server
    app.listen(Port, () => {
      console.log(`Listening to requests on http://localhost:${Port}`);
    })
  })
  .catch(err => console.log(err));

// -- Routes -- //
// LogIn
app.use('/login', require('./routes/login/loginRoute'));

// LogOut
app.use('/logout', require('./routes/login/logoutRoute'));

// Authentication
app.use('/authentication/checkAccessToken', require('./routes/authentication/checkAuthenticationRoute'));
app.use('/authentication/getAccessToken', require('./routes/authentication/getAccessTokenRoute'));
app.use('/authentication/changePassword', require('./routes/authentication/changePasswordRoute')); // update password of a user

// Reset Password
app.use('/resetPassword', require('./routes/authentication/resetPasswordRoute.js'));

// Doctor
app.use('/doctor/register', require('./routes/doctor/registerRoute'));
app.use('/doctor/patients', require('./routes/doctor/patientsRoute'));
app.use('/doctor/profile', require('./routes/doctor/profileRoute'));
app.use('/doctor/filterAppointmentsByDateForDoctor', require('./routes/doctor/filterAppointmentsRoute'));
app.use('/doctor/filterAppointmentsByStatusForDoctor', require('./routes/doctor/filterAppointmentsRoute'));
app.use('/doctor/info', require('./routes/doctor/doctorInfoRoute')); // Get information about logged in doctor using his/her username
app.use('/doctor/viewContract', require('./routes/doctor/viewContractRoute'));
app.use('/doctor/addContract', require('./routes/doctor/viewContractRoute'));
app.use('/doctor/viewDoctors', require('./routes/doctor/viewContractRoute'));
app.use('/doctor/acceptContract', require('./routes/doctor/viewContractRoute'));
app.use('/doctor/rejectContract', require('./routes/doctor/viewContractRoute'));
app.use('/doctor/viewWalletNumber', require('./routes/doctor/viewMyWallet'));
app.use('/doctor/appointments', require('./routes/doctor/appointmentsRoute.js'))
app.use('/doctor/addTimeSlot', doctorRoutes);
app.use('/doctor/uploadHealthRecords', require('./routes/doctor/healthRecordRoute'));
app.use('/doctor/viewPHealthRecords', require('./routes/doctor/viewHealthRoute'));
app.use('/doctor/prescriptionDetails', prescriptionDoctorRoutes);
app.use('/doctor/updatePrescriptions', require('./routes/doctor/updatePrescriptionRoute'));

// Admin
app.use('/admin/viewREQDoctors', require('./routes/admin/viewRequestedDoctorsInfo'));
app.use('/admin/removeDoctor', require('./routes/admin/viewRequestedDoctorsInfo'));
app.use('/admin/addPackage', require('./routes/admin/packageRoute'));
app.use('/admin/updatePackage', require('./routes/admin/packageRoute'));
app.use('/admin/deletePackage', require('./routes/admin/packageRoute'));
app.use('/admin/ViewPackage', require('./routes/admin/packageRoute'));
app.use('/Admin/addremoveclinic', adminRoutes);
app.use('/admin/info', require('./routes/admin/adminInfoRoute')); // Get information about logged in admin using his/her username

// Patient
app.use('/patient/allDoctors', require('./routes/patient/doctorsRoute'));
app.use('/patient/doctorList', doctorListRoutes)
app.use('/patient/register', require('./routes/patient/registerRoute'));
app.use('/patient/appointment', require('./routes/patient/appointmentRoute'));
app.use('/patient/prescriptionDetails', prescriptionRoutes);
app.use('/patient/addFamilyMember', require('./routes/patient/addFamilyMemberRoute'));
app.use('/patient/viewFamilyMembers', require('./routes/patient/viewFamilyMembersRoute'));
app.use('/patient/viewAppointments', require('./routes/patient/filterAppointmentsRoute'));
app.use('/patient/filterAppointmentsByDateForPatient', require('./routes/patient/filterAppointmentsRoute'));
app.use('/patient/filterAppointmentsByStatusForPatient', require('./routes/patient/filterAppointmentsRoute'));
app.use('/patient/info', require('./routes/patient/patientInfoRoute')); // Get information about logged in patient using his/her username
app.use('/patient/linkByEmail', require('./routes/patient/linkPatientWithAnotherRoute'));
app.use('/patient/linkByMobile', require('./routes/patient/linkPatientWithAnotherRoute'));
app.use('/patient/ViewPackages', require('./routes/patient/packagesRoute'));
app.use('/patient/ViewFamily', require('./routes/patient/packagesRoute'));
app.use('/patient/Subscribe', require('./routes/patient/packagesRoute'));
app.use('/patient/Unsubscribe', require('./routes/patient/packagesRoute'));
app.use('/patient/Famsubs', require('./routes/patient/packagesRoute'));
app.use('/patient/Allsubs', require('./routes/patient/packagesRoute'));
app.use('/patient/Allpatients', require('./routes/patient/packagesRoute'));
app.use('/patient/Subs1', require('./routes/patient/packagesRoute'));
app.use('/patient/Subs2', require('./routes/patient/packagesRoute'));
app.use('/patient/viewWalletNumber', require('./routes/patient/viewWallet'));
app.use('/patient/packagePaymentCreditCard', require('./routes/patient/payments/packageCreditCardPayment.js'));
app.use('/patient/packagePaymentWallet', require('./routes/patient/payments/packageWalletPayment.js'));
app.use('/patient/appointmentPaymentCreditCard', require('./routes/patient/payments/appointmentCreditCard.js'));
app.use('/patient/appointmentPaymentWallet', require('./routes/patient/payments/appointmentWallet.js'));
app.use('/patient/viewMedicalHistory',require('./routes/patient/medicalHistoryRoute'));
app.use('/patient/viewHealthRecords', require('./routes/patient/viewHealthRecordsRoute'));




