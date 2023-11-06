const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const asyncHandler = require('express-async-handler');
const patientModel = require('../../models/Patient.js');

const updatePatientPassword = asyncHandler(async (req, res) => {
    const username = req.query.username;
    const currentPassword = req.query.currentPassword;
    const newPassword = req.query.newPassword;

    if (username === undefined) {
        return res.status(400).json({ message: 'Please enter a username', changePassword: false });
    }

    if (currentPassword === undefined) {
        return res.status(400).json({ message: 'Please enter the current password', changePassword: false});
    }

    if (newPassword === undefined) {
        return res.status(400).json({ message: 'Please enter the new password', changePassword: false});
    }

    const patientResults = await patientModel.find({username: username});
    let patient = null;
    
    // check that the patient exists in the database
    if (!patientResults) {
        return res.status(404).json({ message: 'Patient is not found', changePassword: false});
    }
    else {
        patient = patientResults[0];
    }

    const passwordCorrect = await bcrypt.compare(currentPassword, patient.password);

    // compare entered password with the password stored in the database
    if (!passwordCorrect) {
        return res.status(400).json({message: 'Current password is incorrect', changePassword: false});
    }
    else {
        const hashedNewPassword = await bcrypt.hash(newPassword, 10); // hash the new password
        if (newPassword === currentPassword) {
            return res.status(400).json({message: 'Current password can not be same as the new password', changedPassword: false});
        }
        else {
            await patientModel.findOneAndUpdate({username: username}, {password: hashedNewPassword}); // update the patient's password
            return res.status(200).json({message: 'Password is changed successfully', changePassword: true});
        }
    }
});

module.exports = { updatePatientPassword };