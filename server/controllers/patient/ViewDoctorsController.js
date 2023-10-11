const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');
const doctorModel = require('../../models/Doctor');
const patientModel = require('../../models/Patient');
const packageModel = require('../../models/Package');

 
const getDoctors = asyncHandler( async (req, res) => {
    // Check if the patient username is provided
    if (req.query.patient_username === undefined) {
        return res.status(400).json({ message: 'Please add a patient username!' });
    }
    //Check if patient name valid
    const patient = await patientModel.findOne({ username: req.query.patient_username });
    if (!patient) {
        return res.status(404).json({ message: 'Patient not found!' });
    }

    //Check if patient subscribed in any package 
    const packages = await packageModel.find({ subscribed_patients: patient.username });
    console.log(packages);

    //Retrieve all Drs
    const doctors = await doctorModel.find();
    var doctorsresult=[];

    
    if (packages.length>0){

     console.log(packages[0].doctor_discount);
     doctorsresult = doctors.map((doctor) => ({
      ...doctor.toObject(),
      hourly_rate:
        (doctor.hourly_rate + (doctor.hourly_rate * 0.1 ))-( (packages[0].doctor_discount/100.0) * doctor.hourly_rate),
     }));

      res.status(200).json({ message: 'Success', doctorsresult});


    }
    else {

      doctorsresult= doctors.map((doctor) => ({...doctor.toObject(),
            hourly_rate: doctor.hourly_rate + doctor.hourly_rate*0.1
     }));
    
      res.status(200).json({ message: 'Success', doctorsresult});

    }

     
    });


module.exports = { getDoctors };