const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');
const doctorModel = require('../../models/Doctor');
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

    if (doctor.affilitation === undefined) {
        return res.status(400).json({ message: 'Please add an affilitation!', registeredIn: false });
    }

    if (doctor.educational_background === undefined) {
        return res.status(400).json({ message: 'Please add an educational background', registeredIn: false });
    }

    let takenUsername = null;
    let takenEmail = null;

    takenUsername =  await doctorModel.findOne({ username: doctor.username });
    takenEmail = await doctorModel.findOne({ email: doctor.email });

    if (takenUsername) {
        return res.status(400).json({ message: 'Username already taken!', registeredIn: false });
    } else if (takenEmail) {
        return res.status(400).json({ message: 'Email already registered!', registeredIn: false });
    } else {
        // Generate a hashcode of doctor's password
        doctor.password = await bcrypt.hash(doctor.password, 10);
        const newDoctorRequest = await doctorModel.create(doctor);
        res.status(200).json({ message: 'Success', doctor: newDoctorRequest, registeredIn: true });
    }
});
 
// Retrieve all doctors from the database
 const getDoctors = asyncHandler(async (req, res) => {
    let doctors = await doctorModel.find();

    res.status(200).json(doctors);
});
 

module.exports = {createDoctor, getDoctors};