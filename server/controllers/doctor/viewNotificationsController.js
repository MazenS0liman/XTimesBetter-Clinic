const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');
const doctorModel = require('../../models/Doctor');

const getDoctorNotifications= asyncHandler(async (req, res) => {

    
    const doctorArray = await doctorModel.find({ username: req.body.username });
    const doctor = doctorArray[0];
    


    if (doctor) {

       return res.status(200).json({notifications: doctor.notifications});
    } else {
        res.status(400).json({ message: 'Can not retrieve Patient Data!' });
    }


});



module.exports = { getDoctorNotifications };