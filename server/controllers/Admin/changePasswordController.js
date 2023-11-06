const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const asyncHandler = require('express-async-handler');
const adminModel = require('../../models/Admin.js');

const updateAdminPassword = asyncHandler(async (req, res) => {
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

    const adminResults = await adminModel.find({username: username});
    let admin = null;

    // check that the doctor exists in the database
    if (!adminResults) {
        return res.status(404).json({ message: 'Admin is not found', changePassword: false});
    }
    else {
        admin = adminResults[0];
    }

    // hash the current password entered by the doctor
    const passwordCorrect = await bcrypt.compare(currentPassword, admin.password);

    // hashed current password entered does not match the password stored in the database
    if (!passwordCorrect) {
        return res.status(400).json({message: 'Current password is incorrect', changePassword: false});
    }
    else {
        const hashedNewPassword = await bcrypt.hash(newPassword, 10); // hash the new password
        if (newPassword === currentPassword) {
            return res.status(400).json({message: 'Current password can not be same as the new password', changedPassword: false});
        }
        else {
            await adminModel.findOneAndUpdate({username: username}, {password: hashedNewPassword}); // update the admin's password
            return res.status(200).json({message: 'Password is changed successfully', changePassword: true});
        }
    }
});

module.exports = { updateAdminPassword };