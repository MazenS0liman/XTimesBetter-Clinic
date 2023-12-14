const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');
const appointmentModel = require('../../models/Appointment.js');
const doctorModel = require('../../models/Doctor.js')
const followUpModel = require('../../models/FollowUp.js')
const familyModel = require('../../models/Family.js');

const viewUnlinkedFamilyMembers = async (req, res) => {
    try {

        const familyMembers = await familyModel.find();
        if (!familyMembers) {
            return res.status(404).json({ error: 'Patient has no family members' });
        }
        //const familyMembers = await familyModel.find();
        res.status(200).json(familyMembers);
    } catch (error) {
        res.status(500).json({ error: "Can't get your family members" });
    }
}

const viewRequestedFollowUps = async (req, res) => {

    const username = req.body.username;
    console.log(username);
    try {
        const followUps = await followUpModel.find({ doctor_username: username, status: "pending" });
        if (!followUps) {
            return res.status(404).json({ error: 'Doctor has no requested followUps' });
        }
        res.status(200).json(followUps);
    } catch (error) {
        res.status(500).json({ error: "Can't get your requested followUps" });
    }
}

// const acceptFollowUp = async (req, res) => {
//     // const username = req.body.username;
//     const followUp = req.body;
//     try {
//         const acceptedFollowUp = await followUpModel.findOneAndUpdate({ appointment_ID: followUp.appointment_ID }, { status: "accepted" }, { new: true })
//         res.status(200).json(acceptedFollowUp);
//     } catch (error) {
//         res.status(500).json({ error: "Can't accept your followUp" });
//     }
// }
const acceptFollowUp = async (req, res) => {
    const { FollowUpID, appointmentID } = req.body;
    try {
        const oldAppointmentArray = await appointmentModel.find({ _id: appointmentID });
        const oldAppointment = oldAppointmentArray[0];
        console.log(oldAppointment)
        const acceptedFollowUp = await followUpModel.findOneAndUpdate(
            { _id: FollowUpID },
            { status: 'accepted' },
            { new: true }
        );
        const followUpDate = new Date(acceptedFollowUp.followUpDateTime);
        const formattedDate = `${followUpDate.getDate().toString().padStart(2, '0')}/${(followUpDate.getMonth() + 1).toString().padStart(2, '0')}/${followUpDate.getFullYear()}`;

        const appointmentData = {
            patient_username: acceptedFollowUp.patient_username,
            doctor_username: acceptedFollowUp.doctor_username,
            date: formattedDate,
            status: 'upcoming',
            time: acceptedFollowUp.followUpDateTime,
            name: oldAppointment.name,
            //  name: "l2aaaaaaaa",

            price: 0,
            booked_by: oldAppointment.booked_by,
            // booked_by: "nonyyyyyyyyyyyyy",
            isFollowUp: FollowUpID,
        };

        const newAppointment = await appointmentModel.create(appointmentData);

        res.status(200).json({ acceptedFollowUp, newAppointment });
    } catch (error) {
        res.status(500).json({ error: "Can't accept your followUp" });
    }
};

const rejectFollowUp = async (req, res) => {
    const { FollowUpID, appointmentID } = req.body;
    try {
        const rejectedFollowUp = await followUpModel.findOneAndUpdate(
            { _id: FollowUpID },
            { status: 'rejected' },
            { new: true }
        );
        res.status(200).json(rejectedFollowUp);
    } catch (error) {
        res.status(500).json({ error: "Can't reject your followUp" });
    }
};

// const rejectFollowUp = async (req, res) => {
//     // const username = req.body.username;
//     const followUp = req.body;
//     try {
//         const rejectedFollowUp = await followUpModel.findOneAndUpdate({ appointment_ID: followUp.appointment_ID }, { status: "rejected" }, { new: true })
//         res.status(200).json(rejectedFollowUp);
//     } catch (error) {
//         res.status(500).json({ error: "Can't reject your followUp" });
//     }
// }
const addAppointment = async (req, res) => {
    const username = req.body.username;
    const requestedFollowUp = req.body;
    try {
        //  const followUp = await followUpModel.find({ appointment_ID: requestedFollowUp.appointment_ID});
        const appointment = {
            patient_username: requestedFollowUp.patient_username,
            doctor_username: requestedFollowUp.doctor_username,
            date: requestedFollowUp.followUpDateTime.toString(),
            status: "upcoming",
            time: requestedFollowUp.followUpDateTime,
            name: requestedFollowUp.patient_username,
            price: 0,
            //moshkela 
            booked_by: requestedFollowUp.patient_username,
            isFollowUp: requestedFollowUp._id

        };
        const newAppointment = await appointmentModel.create(appointment);
        res.status(201).json(appointment);

    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}


module.exports = { viewRequestedFollowUps, addAppointment, acceptFollowUp, rejectFollowUp, viewUnlinkedFamilyMembers };





