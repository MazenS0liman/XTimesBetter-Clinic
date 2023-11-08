const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');
const contractModel = require('../../models/Contract.js');
const doctorModel = require('../../models/Doctor.js');
const PatientModel = require('../../models/Patient.js');


const viewContract = async (req, res) => {

    const username = req.query;
    try {
        const contract = await contractModel.find({ doctorName: username.username });
        if (!contract) {
            return res.status(404).json({ error: 'Doctor has no contract yet' });
        }
        res.status(200).json(contract);
    } catch (error) {
        res.status(500).json({ error: "Can't get your contract" });
    }
}

const acceptContract = async (req, res) => {

    const username = req.query;
    try {
        const contract = await contractModel.find({ doctorName: username.username });
        if (!contract) {
            return res.status(404).json({ error: 'Doctor has no contract yet' });
        }
        const newContract = await contractModel.findOneAndUpdate({ doctorName: username.username }, { accepted: false }, { new: true })
        res.status(200).json(newContract);
    } catch (error) {
        res.status(500).json({ error: "Can't get your contract" });
    }
}

const addContract = async (req, res) => {
    try {

        const contract = await contractModel.create(req.body);
        res.status(201).json(contract);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// const viewDoctors = async (req, res) => {

//     try {
//         const doctors = await doctorModel.find();
//         if (!doctors) {
//             return res.status(404).json({ error: 'No Doctors' });
//         }
//         res.status(200).json(doctors);
//     } catch (error) {
//         res.status(500).json({ error: "Can't get your doctors" });
//     }
// }
const viewDoctors = async (req, res) => {

    try {
        const doctors = await PatientModel.find();
        if (!doctors) {
            return res.status(404).json({ error: 'No Doctors' });
        }
        res.status(200).json(doctors);
    } catch (error) {
        res.status(500).json({ error: "Can't get your doctors" });
    }
}
module.exports = { viewContract, addContract, viewDoctors, acceptContract };





