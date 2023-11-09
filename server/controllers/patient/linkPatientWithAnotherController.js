const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');
const LinkedFamilyModel = require('../../models/LinkedFamily.js');
const patientModel = require('../../models/Patient.js');

const linkFamilyMemberByEmail = async (req, res) => {
    const username = req.body.username;

    const relation = req.body.relation;
    console.log(req.body);
    console.log(username);
    try {

        const patient = await patientModel.findOne({ email: req.body.email });

        if (!patient) {
            return res.status(404).json('Patient doesnot exist!');
        }
        const Linkedmember = {
            username: patient.username, name: patient.name, email: patient.email, password: patient.password, dob: patient.dob,
            gender: patient.gender, mobile: patient.mobile, emergency_contact: patient.emergency_contact, subscribed_package: patient.subscribed_package,
            medicalHistory: patient.medicalHistory, relation: relation, patient_username: username
        };
        const linkedMember = await LinkedFamilyModel.create(Linkedmember);
        res.status(201).json(linkedMember);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}
const linkFamilyMemberByMobile = async (req, res) => {
    const username = req.body.username;
    const relation = req.body.relation;
    try {

        const patient = await patientModel.findOne({ mobile: req.body.mobile });

        if (!patient) {
            return res.status(404).json('Patient doesnot exist!');
        }
        const Linkedmember = {
            username: patient.username, name: patient.name, email: patient.email, password: patient.password, dob: patient.dob,
            gender: patient.gender, mobile: patient.mobile, emergency_contact: patient.emergency_contact, subscribed_package: patient.subscribed_package,
            medicalHistory: patient.medicalHistory, relation: relation, patient_username: username
        };
        const linkedMember = await LinkedFamilyModel.create(Linkedmember);
        res.status(201).json(linkedMember);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}


module.exports = { linkFamilyMemberByEmail, linkFamilyMemberByMobile };