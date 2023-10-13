const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');
const familyModel = require('../../models/Family.js');
const patientModel = require('../../models/Patient.js');

const addFamilyMember = async (req, res) => {
    try {

        const patient = await patientModel.findOne({
            username: req.body.patient_username,
        });
        /* if (!patient) {
             return res.status(404).json({ error: 'Patient does not exist' });
         }*/
        if (!patient) {
            return res.status(404).json('');
        }
        const familyMember = await familyModel.create(req.body);
        res.status(201).json(familyMember);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}


module.exports = { addFamilyMember };