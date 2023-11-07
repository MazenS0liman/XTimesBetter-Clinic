const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');
const doctorModel = require('../../models/Doctor.js');

const getDoctorInfo = asyncHandler(async (req, res) => {
    const username = req.body.username;

    if (username === undefined) {
        return res.status(400).json({ message: 'Please enter a username', doctor: null, found: false });
    }

    const doctor = await doctorModel.find({username: username});

    if (!doctor) {
        return res.status(404).json({message: 'Doctor not found', doctor: null,found: false});
    }
    else {
        return res.status(200).json({message: 'Doctor found', doctor: doctor, found: true});
    }
})

module.exports = { getDoctorInfo };