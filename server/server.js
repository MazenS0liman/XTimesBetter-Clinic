const express = require('express');
const dotenv = require('dotenv').config();
const colors = require('colors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cors = require('cors'); // Import CORS for handling cross-origin requests
const { getMedicines, createPrescription,getPrescription } = require('./controllers/patient/prescriptionsController'); // Import your controllers
const prescriptionRoutes = require('./routes/patient/prescriptions');
const Prescription = require('./models/Prescription');

mongoose.set('strictQuery', false);
const Port = process.env.PORT || 5000;

// Express app
const app = express();
app.use(cors());

// App variables
// const Port = process.env.PORT || 5000;
const MongoURI = process.env.MONGO_URI;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
    async function yourFunctionToFetchPrescriptions() {
      try {
        // Use Mongoose to query the database for prescription data
        const prescriptions = await Prescription.find({}, 'patient_username doctor_username visit_date filled');
    
        // Return the fetched prescription data
        return prescriptions;
      } catch (error) {
        // Handle any errors that occur during the database query
        console.error('Error fetching prescription data:', error);
        throw error;
      }
    }app.get('/api/getPrescriptions', async (req, res) => {
  try {
    // Use your backend function to fetch the prescription data
    const prescriptionData = await yourFunctionToFetchPrescriptions();

    // Return the data as JSON
    res.json({ prescriptions: prescriptionData });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch prescription data' });
  }
});
 app.listen(Port, () => {
      console.log(`Listening to requests on http://localhost:${Port}`);
    })
  })
.catch(err => console.log(err));
app.use('/patient/prescriptionDetails',prescriptionRoutes)

