const express = require('express');
const dotenv = require('dotenv').config();
const colors = require('colors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cors = require('cors');

mongoose.set('strictQuery', false);

// Express app
const app = express();

// App variables
const Port = process.env.PORT || 5000;
const MongoURI = process.env.MONGO_URI;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

// Routes 
app.use('/patient/addFamilyMember', require('./routes/patient/addFamilyMemberRoute'));
app.use('/patient/viewFamilyMembers', require('./routes/patient/viewFamilyMembersRoute'));
app.use('/patient/viewAppointments', require('./routes/patient/filterAppointmentsRoute'));
app.use('/patient/filterAppointmentsByDateForPatient', require('./routes/patient/filterAppointmentsRoute'));
app.use('/patient/filterAppointmentsByStatusForPatient', require('./routes/patient/filterAppointmentsRoute'));

app.use('/doctor/filterAppointmentsByDateForDoctor', require('./routes/doctor/filterAppointmentsRoute'));
app.use('/doctor/filterAppointmentsByStatusForDoctor', require('./routes/doctor/filterAppointmentsRoute'));

