const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');
const patientModel = require('../../models/Patient');

const getPatientNotifications= asyncHandler(async (req, res) => {

    
    const patientArray = await patientModel.find({ username: req.body.username });
    const patient = patientArray[0];
    


    if (patient) {

       return res.status(200).json({notifications: patient.notifications});
    } else {
        res.status(400).json({ message: 'Can not retrieve Patient Data!' });
    }


});



module.exports = { getPatientNotifications };