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
const MongoURI = process.env.MONGO_URI;
app.delete('/prescriptions/:id', async (req, res) => {
  try {
    const prescriptionId = req.params.id;

    // Use the Mongoose model to delete the prescription by its ID
    const deletedPrescription = await Prescription.findByIdAndDelete(prescriptionId);

    if (!deletedPrescription) {
      res.status(404).json({ message: 'Prescription not found' });
      return;
    }

    res.status(200).json({ message: 'Prescription deleted', deletedPrescription });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting prescription', error: error.message });
  }
});
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

 app.listen(Port, () => {
      console.log(`Listening to requests on http://localhost:${Port}`);
    })
  })
.catch(err => console.log(err));
app.use('/patient/prescriptionDetails',prescriptionRoutes)

