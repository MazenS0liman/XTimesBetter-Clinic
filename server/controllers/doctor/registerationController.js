const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');
const doctorModel = require('../../models/Doctor');
const doctorRequestsModel = require('../../models/DoctorRequests');
const bcrypt = require('bcrypt');

// Add a new doctor to the database
const createDoctor = asyncHandler( async(req,res) => {
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

    takenUsername =  await doctorModel.findOne({ username: doctor.username });
    takenEmail = await doctorModel.findOne({ email: doctor.email });
    takenUsernameReq =  await doctorRequestsModel.findOne({ username: doctor.username });
    takenEmailReq = await doctorRequestsModel.findOne({ email: doctor.email });

    if (takenUsername || takenUsernameReq) {
        return res.status(400).json({ message: 'Username already taken!', registeredIn: false });
    } else if (takenEmail || takenEmailReq) {
        return res.status(400).json({ message: 'Email already registered!', registeredIn: false });
    } else {
        // Generate a hashcode of doctor's password
        doctor.password = await bcrypt.hash(doctor.password, 10);
        const newDoctorRequest = await doctorRequestsModel.create(doctor);
        res.status(200).json({ message: 'Success', doctor: newDoctorRequest, registeredIn: true });
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
 

module.exports = {createDoctor, getDoctors, getDoctorRequests};
