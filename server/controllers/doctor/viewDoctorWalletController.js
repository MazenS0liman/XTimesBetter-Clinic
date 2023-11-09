const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');
const doctorModel = require('../../models/Doctor');

const viewDoctorWalletNumber = async (req, res) => {
    const username = req.body.username;
     try {
        const doctor = await doctorModel.findOne({username: username});
         if (doctor) {
             const doctorWalletNumber = doctor.walletAmount;
             res.status(200).json(doctorWalletNumber);
 
         } else {
            return res.status(404).json({ error: 'Doctor not found' })
         }
         
     } catch (error) {
         res.status(500).json({ error: "Can't get your wallet Number" });
     }
 }
 
module.exports = { viewDoctorWalletNumber };




