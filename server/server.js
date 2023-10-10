const express = require('express');
const dotenv = require('dotenv').config();
const colors = require('colors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cors = require('cors'); // Import CORS for handling cross-origin requests
const { getMedicines, createPrescription,getPrescription } = require('./controllers/patient/prescriptionsController'); // Import your controllers
const prescriptionRoutes = require('./routes/patient/prescriptions')

mongoose.set('strictQuery', false);
const Port = process.env.PORT || 3000;

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
  // app.get('/patient/prescriptions/viewMyPrescriptions', async (req, res) => {
  //   try {
  //     const users = await userModel.find();
  //     res.status(200).json({ message: 'Success', prescriptions: users });
  //   } catch (error) {
  //     res.status(500).json({ error: 'Failed to fetch prescriptions' });
  //   }
  // });
  app.get('/api/prescriptions', async (req, res) => {
    try {
      const prescriptions = await Prescription.find();
      res.json({ prescriptions });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch prescriptions' });
    }
  });
  // app.get("/message", (req, res) => {
  //   res.json({ message: "Hello from server!" });
  // });
  
    // Starting server
    app.listen(Port, () => {
      console.log(`Listening to requests on http://localhost:${Port}`);
    })
  })
.catch(err => console.log(err));
app.use('/patient/prescriptionDetails',prescriptionRoutes)

