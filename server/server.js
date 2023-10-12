const express = require('express');
const dotenv = require('dotenv').config();
const colors = require('colors');
const mongoose = require('mongoose');
var cors = require('cors');
var bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const adminRoutes= require('./routes/Admin/adminRoute.js');
mongoose.set('strictQuery', false);

// Express app
const app = express();
const allowedOrigins = ['http://localhost:5173'];
// const corsOptions = {
//   origin: (origin, callback) => {
//     if (allowedOrigins.includes(origin) || !origin) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
// };

// Enable CORS for all routes or specify it for specific routes.
// app.use(cors(corsOptions));
// App variables
const Port = process.env.PORT || 5000;
const MongoURI = process.env.MONGO_URI;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const corsOptions ={
  origin:'*', 
  credentials:true,            //access-control-allow-credentials:true
  optionSuccessStatus:200,
}

app.use(cors(corsOptions))


// Middleware for allowing react to fetch() from server
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, OPTIONS');
  next();
});

// Connect to MongoDB
mongoose.connect(MongoURI)
.then(()=>{
  console.log("MongoDB is now connected!")
  
  // Starting server
  app.listen(Port, () => {
    console.log(`Listening to requests on http://localhost:${Port}`);
  })
})
.catch(err => console.log(err));

// Routes
// Patient
app.use('/patient/register', require('./routes/patient/registerRoute'));
app.use('/patient/appointment', require('./routes/patient/appointmentRoute'));

// Doctor
app.use('/doctor/register', require('./routes/doctor/registerRoute'));
app.use('/doctor/patients', require('./routes/doctor/patientsRoute'));

// Routes
// Admin (Packages)
app.use('/admin/addPackage', require('./routes/admin/packageRoute'));
app.use('/admin/updatePackage', require('./routes/admin/packageRoute'));
app.use('/admin/deletePackage', require('./routes/admin/packageRoute'));
app.use('/admin/ViewPackage', require('./routes/admin/packageRoute'));
app.use('/Admin/addremoveclinic', adminRoutes);


// Patient
//View all doctors 
app.use('/patient/allDoctors', require('./routes/patient/doctorsRoute'));

