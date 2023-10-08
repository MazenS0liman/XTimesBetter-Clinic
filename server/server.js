const express = require('express');
const dotenv = require('dotenv').config();
const colors = require('colors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cors = require('cors'); // Import CORS for handling cross-origin requests
const { viewMyPrescriptions, createPrescription,getPrescription } = require('./controllers/patient/prescriptionsController'); // Import your controllers
const prescriptionRoutes = require('./routes/patient/prescriptions')

mongoose.set('strictQuery', false);

// Express app
const app = express();
// app.use(cors());

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
  app.get('/patient/prescriptions/viewMyPrescriptions', async (req, res) => {
    try {
      const users = await userModel.find();
      res.status(200).json({ message: 'Success', prescriptions: users });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch prescriptions' });
    }
  });
  app.get('getPres',(req,res)=>{
    userModel.find()
    .then(prescriptions => res.json(prescriptions))
    .catch(err => res.json(err))

  })
  app.use('/api/prescriptions',prescriptionRoutes)

  // Starting server
  app.listen(8000, () => {
    console.log(`Listening to requests on http://localhost:8000`);
  })
})
.catch(err => console.log(err));
// app.get('/patient/prescriptions/viewMyPrescriptions', viewMyPrescriptions);
// app.post('/patient/prescriptions/create', createPrescription);

