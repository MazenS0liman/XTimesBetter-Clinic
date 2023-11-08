const express = require('express');
const dotenv = require('dotenv').config();
const colors = require('colors');
const mongoose = require('mongoose');
const cors = require('cors');
var bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const adminRoutes = require('./routes/admin/adminRoute.js');
const prescriptionRoutes = require('./routes/patient/prescriptions');
const doctorListRoutes = require('./routes/patient/doctorListRoutes')

mongoose.set('strictQuery', false);

// Express app
const app = express();

// App variables
const Port = process.env.PORT || 5000;
const MongoURI = process.env.MONGO_URI;
const corsOptions = {
  origin: '*',
  credentials: true,
  optionSuccessStatus: 200,
}

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions))

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


