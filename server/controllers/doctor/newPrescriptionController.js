const Medicine = require('../../models/Medicine')
const Appointment = require('../../models/Appointment')
const Prescription = require('../../models/Prescription')
const Patient = require('../../models/Patient')
const Family = require('../../models/Family')
const mongoose = require('mongoose')


//get all my patients of completed appointments
const getMyPatientsCompleted = async (req, res) => {
    const doctorUsername = req.body.username;
    const doctorPrescriptionVisitIDs = await Prescription.distinct('visitID', {
        visitID: { $exists: true },
        doctor_username: doctorUsername
    });
    //console.log(doctorPrescriptionVisitIDs)
    const myPatients = await Appointment.find({ doctor_username: doctorUsername, status: 'completed' });
    const filteredPatients = myPatients.filter(patient => !doctorPrescriptionVisitIDs.includes(patient._id.toString())); //to get only appointments that have no prescription
    //console.log(filteredPatients)
    res.status(200).json(filteredPatients);

}

//get all medicines 
const getAllMedicines = async (req, res) => {
    const medicines = await Medicine.find({ archived: false }).sort({ createdAt: -1 });
    res.status(200).json(medicines)
}


//Add med to prescription
let prescriptionMeds = []

const addMedToPrescription = async (req, res) => {
    const { medName, price, prescriptionMeds } = req.body;
    const existingItem = prescriptionMeds.find((prescribedMed) => prescribedMed.name === medName);
    const medicine = await Medicine.findOne({ name: medName });

    if (existingItem) {
        console.log("Medicine already added!");
        res.status(400).json({ message: 'Medicine already prescribed', prescriptionMeds });
    } else {
        const med = {
            name: medName,
            price: price,
            dosage: ""
        };
        prescriptionMeds.push(med);
        res.status(200).json({ success: true, message: 'Medicine added', prescriptionMeds });
    }
};

//view prescription for finalizing
const viewPrescription = async (req, res) => {
    res.json({ prescriptionMeds });

}

//save prescription to db
const savePrescription = async (req, res) => {
    const { patientUsername, visitDate, visitID, prescriptionMeds } = req.body;
    const doctorUsername = req.body.username;
    const newPrescription = await Prescription.create({
        patient_username: patientUsername,
        doctor_username: doctorUsername,
        visit_date: visitDate,
        filled: false,
        medicines: prescriptionMeds,
        visitID: visitID
    })
    res.status(200).json({ message: 'Prescription Added', newPrescription });

}

//get patient's details
const getPatientDetails = async (req, res) => {
    const { patientUsername } = req.params;

    try {
        const patient = await Patient.findOne({ username: patientUsername });
        if (!patient) {
            const familyMember = await Family.findOne({ national_id: patientUsername });
            res.status(200).json(familyMember);
        }
        else {
            const today = new Date();
            const birthDate = new Date(patient.dob);
            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            let user = { ...patient._doc, age };
            res.status(200).json(user);
        }

    } catch (error) {
        console.error('Error fetching patient information:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports = {
    getMyPatientsCompleted,
    getAllMedicines,
    addMedToPrescription,
    viewPrescription,
    savePrescription,
    getPatientDetails

}