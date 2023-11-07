const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');
const patientModel = require('../../models/Patient');

const viewWalletNumber = async (req, res) => {

   // const username = req.query;

    try {
        const patient = await patientModel.findOne({username: "john_doe123"});
        if (patient) {
            const patientWalletNumber = patient.walletAmount;
            res.status(200).json(patientWalletNumber);

        } else {
            return res.status(404).json({ error: 'patient not found' })
        }
        
    } catch (error) {
        res.status(500).json({ error: "Can't get your wallet Number" });
    }
}
module.exports = { viewWalletNumber };




