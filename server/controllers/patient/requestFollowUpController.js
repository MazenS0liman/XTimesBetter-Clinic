const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');
const appointmentModel = require('../../models/Appointment.js');
const doctorModel = require('../../models/Doctor.js')
const followUpModel = require('../../models/FollowUp.js')
const family = require('../../models/Family.js');
const LinkedFamily = require('../../models/LinkedFamily.js');

const viewPastAppointmentWithoutFollowUp = asyncHandler(async (req, res) => {
    const username = req.body.username;

    try {
        // Find the patient's linked family members
        const linkedFamilyMembers = await LinkedFamily.find({
            patient_username: username,
        });

        // Extract usernames of family members
        const familyUsernames = linkedFamilyMembers.map((familyMember) => familyMember.username);

        // Find past completed appointments for the patient
        const pastCompletedAppointments = await appointmentModel.find({
            $or: [
                { patient_username: username },
                { patient_username: { $in: familyUsernames } },
                { booked_by: username },
            ],
            status: 'completed',
        });
        //Find existing follow-ups for the patient
        const existingFollowUps = await followUpModel.find({
            appointment_ID: { $in: pastCompletedAppointments.map(appointment => appointment._id) },
        });

        // Extract appointment IDs from existing follow-ups
        const existingFollowUpAppointmentIDs = existingFollowUps.map(followUp => followUp.appointment_ID.toString());

        // Filter past completed appointments without an existing follow-up
        const pastCompletedAppointmentsWithoutFollowUp = pastCompletedAppointments.filter(
            appointment => !existingFollowUpAppointmentIDs.includes(appointment._id.toString())
        );

        if (pastCompletedAppointmentsWithoutFollowUp.length === 0) {
            return res.status(404).json({ error: 'No past completed appointments without an existing follow-up found' });
        }

        res.status(200).json(pastCompletedAppointmentsWithoutFollowUp);
    } catch (error) {
        res.status(500).json({ error: "Can't get past completed appointments without an existing follow-up" });
    }
});



// WORKING ONE 

// const viewPastAppointmentWithoutFollowUp = asyncHandler(async (req, res) => {
//     const username = req.body.username;

//     try {
//         // Find the patient's linked family members
//         const linkedFamilyMembers = await LinkedFamily.find({
//             patient_username: username,
//         });

//         // Extract usernames of family members
//         const familyUsernames = linkedFamilyMembers.map((familyMember) => familyMember.username);

//         // Find past completed appointments for the patient
//         const pastCompletedAppointments = await appointmentModel.find({
//             $or: [
//                 { patient_username: username },
//                 { patient_username: { $in: familyUsernames } },
//                 { booked_by: username },
//             ],
//             status: 'completed',
//         });

//         console.log('Past Completed Appointments:', pastCompletedAppointments);

//         // Find existing follow-ups for the patient
//         const existingFollowUps = await followUpModel.find({
//             patient_username: username,
//             appointment_ID: { $in: pastCompletedAppointments.map(appointment => appointment._id) },
//         });

//         console.log('Existing Follow-ups:', existingFollowUps);

//         // Extract appointment IDs from existing follow-ups
//         const existingFollowUpAppointmentIDs = existingFollowUps.map(followUp => followUp.appointment_ID);

//         // Filter past completed appointments without an existing follow-up
//         const pastCompletedAppointmentsWithoutFollowUp = pastCompletedAppointments.filter(
//             appointment => !existingFollowUpAppointmentIDs.includes(appointment._id)
//         );

//         console.log('Filtered Appointments:', pastCompletedAppointmentsWithoutFollowUp);

//         if (pastCompletedAppointmentsWithoutFollowUp.length === 0) {
//             return res.status(404).json({ error: 'No past completed appointments without an existing follow-up found' });
//         }

//         res.status(200).json(pastCompletedAppointmentsWithoutFollowUp);
//     } catch (error) {
//         console.error('Error fetching past appointments:', error);
//         res.status(500).json({ error: "Can't get past completed appointments without an existing follow-up" });
//     }
// });


// const viewPastAppointmentWithoutFollowUp = asyncHandler(async (req, res) => {
//     const username = req.body.username;

//     try {

//         // Find past completed appointments for the patient
//         const pastCompletedAppointments = await appointmentModel.find({
//             patient_username: username,
//             status: 'completed',
//         });

//         // Find existing follow-ups for the patient
//         const existingFollowUps = await followUpModel.find({
//             patient_username: username,
//             appointment_ID: { $in: pastCompletedAppointments.map(appointment => appointment._id) },
//         });

//         // Extract appointment IDs from existing follow-ups
//         const existingFollowUpAppointmentIDs = existingFollowUps.map(followUp => followUp.appointment_ID);

//         // Filter past completed appointments without an existing follow-up
//         const pastCompletedAppointmentsWithoutFollowUp = pastCompletedAppointments.filter(
//             appointment => !existingFollowUpAppointmentIDs.includes(appointment._id)
//         );

//         if (pastCompletedAppointmentsWithoutFollowUp.length === 0) {
//             return res.status(404).json({ error: 'No past completed appointments without an existing follow-up found' });
//         }

//         res.status(200).json(pastCompletedAppointmentsWithoutFollowUp);
//     } catch (error) {
//         res.status(500).json({ error: "Can't get past completed appointments without an existing follow-up" });
//     }
// });


// const viewPastAppointmentWithoutFollowUp = asyncHandler(async (req, res) => {
//     const username = req.body.username;

//     try {
//         console.log("NAYERAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
//         // Find the patient's linked family members
//         const linkedFamilyMembers = await LinkedFamily.find({
//             patient_username: username,
//         });

//         // Extract usernames of family members
//         const familyUsernames = linkedFamilyMembers.map((familyMember) => familyMember.username);
//         console.log("da5aleeeeeeeeeeeeeeeeeet");
//         console.log(familyUsernames);
//         // Find past completed appointments for the patient
//         const pastCompletedAppointments = await appointmentModel.find({
//             // $or: [
//             //     { patient_username: username },
//             //     { patient_username: { $in: familyUsernames } },
//             //     { booked_by: username },
//             // ],
//             patient_username: username,
//             status: 'completed',
//         });
//         console.log('Past Completed Appointments:', pastCompletedAppointments);
//         // Find existing follow-ups for the patient
//         const existingFollowUps = await followUpModel.find({
//             patient_username: username,
//             appointment_ID: { $in: pastCompletedAppointments.map(appointment => appointment._id) },
//         });

//         // Extract appointment IDs from existing follow-ups
//         const existingFollowUpAppointmentIDs = existingFollowUps.map(followUp => followUp.appointment_ID);

//         // Filter past completed appointments without an existing follow-up
//         const pastCompletedAppointmentsWithoutFollowUp = pastCompletedAppointments.filter(
//             appointment => !existingFollowUpAppointmentIDs.includes(appointment._id)
//         );

//         if (pastCompletedAppointmentsWithoutFollowUp.length === 0) {
//             return res.status(404).json({ error: 'No past completed appointments without an existing follow-up found' });
//         }

//         res.status(200).json(pastCompletedAppointmentsWithoutFollowUp);
//     } catch (error) {
//         res.status(500).json({ error: "Can't get past completed appointments without an existing follow-up" });
//     }
// });

// const patientModel = require('../../models/Patient.js')

// const viewPastAppointment = async (req, res) => {

//     const username = req.body.username;

//     try {
//         const appointment = await appointmentModel.find({ patient_username: username, status: "completed" });
//         const existingFollowUp = await followUpModel.findOne({
//             patient_username: username,
//             status: "pending"
//         });

//         if (!appointment) {
//             return res.status(404).json({ error: 'Patient has no past appointment' });
//         }
//         // if (!existingFollowUp)
//         res.status(200).json(appointment);
//     } catch (error) {
//         res.status(500).json({ error: "Can't get your appointments" });
//     }
// }

const getFollowUps = asyncHandler(async (req, res) => {
    const patient = req.body.username
    const followUps = await followUpModel.find({ patient_username: patient })
    res.status(200).json(followUps);
})

const requestFollowUp = asyncHandler(async (req, res) => {
    const loggedUser = req.body.username;
    const request = req.body;

    if (
        request.doctor_username === undefined ||
        request.patient_username === undefined ||
        request.appointmentDateTime === undefined ||
        request.followUpDateTime === undefined
    ) {
        res.status(400).json({
            message: 'Please provide doctor username, patient username, and appointment date',
            createdFollowUp: false
        });
        return;
    }

    const followUpDateTime = new Date(request.followUpDateTime);
    const currentDate = new Date();

    // Check if followUpDateTime is earlier than the current date and time
    if (followUpDateTime < currentDate) {
        res.status(400).json({
            message: 'Appointment date and time are in the past',
            createdFollowUp: false
        });
        return;
    }
    // Fetch the doctor from the database
    const doctor = await doctorModel.findOne({ username: request.doctor_username });

    // Check if the doctor is found
    if (!doctor) {
        res.status(400).json({
            message: 'Doctor not found',
            createdFollowUp: false
        });
        return;
    }
    // Check for duplicate follow-up appointments
    const existingFollowUp = await followUpModel.findOne({
        // appointmentDateTime: request.appointmentDateTime,
        appointment_ID: request.appointment_ID
    });

    if (existingFollowUp) {
        const errorMessage = 'Duplicate follow-up appointment found';
        console.log(errorMessage); // Log the error message
        res.status(400).json({ message: errorMessage, createdFollowUp: false });
        return;
    }

    request.status = "pending";
    // Appointment ID    
    //appointment.appointment_ID = appointment._id

    const newFollowUp = await followUpModel.create(request);

    //   console.log('Available Time Slots Before:', doctor.availableTimeSlots);

    const appointmentTimeAsString = new Date(request.appointmentDateTime).toISOString();

    const remainingTimeSlots = doctor.availableTimeSlots.filter(slot => {
        const slotAsString = new Date(slot).toISOString();
        return slotAsString !== appointmentTimeAsString;
    });

    //   console.log('Available Time Slots After:', remainingTimeSlots);

    doctor.availableTimeSlots = remainingTimeSlots;
    await doctor.save();

    res.status(200).json({ message: 'Success', request: newFollowUp, createdFollowUp: true });
})

module.exports = { requestFollowUp, viewPastAppointmentWithoutFollowUp, getFollowUps };