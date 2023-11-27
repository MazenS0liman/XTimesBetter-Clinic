const Medicine = require('../../models/Medicine')
const Appointment = require('../../models/Appointment')
const Prescription = require('../../models/Prescription')
const mongoose = require('mongoose')


//get all my patients of completed appointments
const getMyPatientsCompleted = async (req, res) => {
    const doctorUsername = req.body.username;
    const myPatients = await Appointment.find({ doctor_username: doctorUsername, status: 'completed' });
    res.status(200).json(myPatients);

}

//get all medicines 
const getAllMedicines = async (req, res) => {
    const medicines = await Medicine.find({}).sort({ createdAt: -1 });
    res.status(200).json(medicines)
}


//Add med to prescription
let prescriptionMeds = []

const addMedToPrescription = async (req, res) => {
    const { medName, dose, notes } = req.body;
    prescriptionMeds = req.body.prescriptionMeds; //added so that I have the updated prescribed meds from session (solving 'back' issue)
    const existingItem = prescriptionMeds.find((prescribedMed) => prescribedMed.name === medName);
    const medicine = await Medicine.findOne({ name: medName });
    if (existingItem) {
        console.log("Medicine already added!")
        res.status(400).json({ message: 'Medicine already prescribed', prescriptionMeds });
    }
    else {
        const med = {
            name: medName,
            dose: dose,
            timing: notes
        };
        prescriptionMeds.push(med);
        res.status(200).json({ success: true, message: 'Medicine added', prescriptionMeds });
    }
}


//view prescription for finalizing
const viewPrescription = async (req, res) => {
    res.json({ prescriptionMeds });

}

//save prescription to db
const savePrescription = async (req, res) => {
    const { patientUsername, visitDate, prescriptionMeds } = req.body;
    const doctorUsername = req.body.username;
    const newPrescription = await Prescription.create({
        patient_username: patientUsername,
        doctor_username: doctorUsername,
        visit_date: visitDate,
        filled: false,
        medicines: prescriptionMeds
    })
    res.status(200).json({ message: 'Prescription Added', newPrescription });

}

module.exports = {
    getMyPatientsCompleted,
    getAllMedicines,
    addMedToPrescription,
    viewPrescription,
    savePrescription

}