const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');
const appointmentModel = require('../../models/Appointment.js');
const doctorModel = require('../../models/Doctor.js')
const followUpModel = require('../../models/FollowUp.js')
const patientModel = require('../../models/Patient.js')
const { sendEmail } = require('../patient/payments/emailHelper.js');

const { format } = require('date-fns');

const getAppointments = async (req, res) => {
    const doctor = await doctorModel.findOne({
        username: req.body.username,
    });
    const appointments = await appointmentModel.find({doctor_username: doctor.username});
    res.status(200).json(appointments);
}

const getUpcomingAppointments = asyncHandler(async (req, res) => {
    const doctor = await doctorModel.findOne({
        username: req.body.username,
    });
    if (!doctor) {
        return res.status(404).json('ss');
    }
    const upcomingAppointments = await appointmentModel.find({ doctor_username: doctor.username, status: "upcoming" });
    res.status(200).json(upcomingAppointments);
});

const getPastAppointments = asyncHandler(async (req, res) => {
    const doctor = await doctorModel.findOne({
        username: req.body.username,
    });
    if (!doctor) {
        return res.status(404).json('ss');
    }
    const upcomingAppointments = await appointmentModel.find({ doctor_username: doctor.username, status: "completed" });
    res.status(200).json(upcomingAppointments);
});

/*const getPastAppointmentsFollowUp = async (req,res) => {
    // Find the doctor
    const doctor = await doctorModel.findOne({
        username: req.body.username,
    });

    if (!doctor) {
        throw new Error('Doctor not found');
    }

    // Get completed appointments that don't have a follow up
    const completedAppointments = await appointmentModel.find({ 
        doctor_username: doctor.username, 
        status: "completed" ,
        $or: [
            { isFollowUp: { $exists: false } },  // Include appointments where isFollowUp does not exist
            { isFollowUp: { $eq: "" } }          // Include appointments where isFollowUp is an empty string
        ]});

    console.log("Completed Appointments", completedAppointments);

    res.status(200).json(completedAppointments);
};*/

const getPastAppointmentsFollowUp = async (req, res) => {
    try {
        // Find the doctor
        const doctor = await doctorModel.findOne({
            username: req.body.username,
        });

        // Get follow-up appointment IDs
        const followUpAppointmentIds = await appointmentModel
            .find({
                isFollowUp: { $ne: "" }, // Find all appointments with a follow-up
            })
            .distinct('isFollowUp');

        // Get completed appointments for the doctor that don't have a follow-up
        const completedAppointments = await appointmentModel.find({
            doctor_username: doctor.username,
            status: "completed",
            isFollowUp: { $eq: "" }, // Check if isFollowUp is empty
            _id: { $nin: followUpAppointmentIds } // Check if _id is not in any isFollowUp
        });

        res.status(200).json(completedAppointments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};



const scheduleFollowUpAppointment = asyncHandler(async (req,res) => {
    const appointment = req.body;

    //console.log(appointment);

    const followUpDateTime = new Date(appointment.followUpDateTime);
    const currentDate = new Date();

    // Check if followUpDateTime is earlier than the current date and time
    if (followUpDateTime < currentDate) {
        res.status(400).json({
            message: 'Appointment date and time are in the past',
            createdAppointment: false
        });
        return;
    }

    const followUpAppointment = {
        doctor_username: appointment.appointment.doctor_username,
        patient_username: appointment.appointment.patient_username,
        date: appointment.followUpDate,
        time: appointment.followUpDateTime,
        status: 'upcoming',
        name: appointment.appointment.name,
        price: 0,  
        booked_by: appointment.appointment.booked_by,
        isFollowUp: appointment.appointment_ID  // Set isFollowUp to the old appointment ID
    }

    console.log(followUpAppointment);

    const newAppointment = await appointmentModel.create(followUpAppointment);
    console.log("newAppointment")

    res.status(200).json({ message: 'Success', createdAppointment: true, appointment: newAppointment });
})


const getScheduledFollowUp = asyncHandler(async (req, res) => {
    const doctor = req.body.username
    
    const followUps = await appointmentModel.find({
        doctor_username: doctor,
        isFollowUp: { $ne: "" } // $ne means not equal to an empty string
    });

    
    res.status(200).json(followUps);
})

const rescheduleAppointment = asyncHandler(async (req, res) => {
    const { appointmentId, newDate, newTime } = req.body;

    if (!appointmentId || !newDate || !newTime) {
        res.status(400).json({ message: 'Please provide appointment ID, new date, and new time', rescheduledAppointment: false });
        return;
    }

    const existingAppointment = await appointmentModel.findById(appointmentId);

    if (!existingAppointment) {
        res.status(404).json({ message: 'Appointment not found', rescheduledAppointment: false });
        return;
    }

    //Logy added
    const registeredPatient = await patientModel.findOne({ username: existingAppointment.booked_by});

    const currentDate = new Date().toLocaleDateString('en-GB');
    const newAppointmentDate = new Date(newDate);

    if (newAppointmentDate < currentDate) {
        res.status(400).json({ message: 'New appointment date is in the past', rescheduledAppointment: false });
        return;
    }

    // Mark existing appointment as "reschedule"
    existingAppointment.status = 'reschedule';
    await existingAppointment.save();

    // Create a new appointment with updated date and time
    const updatedAppointment = await appointmentModel.create({
        doctor_username: existingAppointment.doctor_username,
        patient_username: existingAppointment.patient_username,
        date: newDate,
        time: newTime,
        name: existingAppointment.name,
        price: existingAppointment.price,
        booked_by: existingAppointment.booked_by,
        status: 'upcoming',
    });

    // Get the doctor and remove the chosen time slot from available time slots
    const doctor = await doctorModel.findOne({ username: existingAppointment.doctor_username });

    if (doctor) {
        const chosenTimeSlot = new Date(newTime);
        doctor.availableTimeSlots = doctor.availableTimeSlots.filter(slot => {
            return slot.getTime() !== chosenTimeSlot.getTime();
        });
        await doctor.save();
    }

    //Added by Logy
    const formattedOldTime = new Date(existingAppointment.time).toLocaleTimeString();
    const formattedNewTime = new Date(updatedAppointment.time).toLocaleTimeString();

                let notificationMessageDoctor;
                let notificationMessageRegisteredPatient;


                if (req.body.patientUsername === req.body.bookedUsername) {
                    //console.log("enter if,")
                    notificationMessageDoctor = `
                    Dear Dr. ${doctor.name},

                    The following appointment has been successfully rescheduled:

                    Patient: ${registeredPatient.name}
                    Original Appointment: ${formattedOldTime} on ${existingAppointment.date}
                    Rescheduled to: ${formattedNewTime} on ${updatedAppointment.date}
                    Status: Rescheduled

                    Thank you for your attention to this update.

                    Best regards.
                   `;

                    await patientModel.findByIdAndUpdate(
                        registeredPatient._id,
                        {
                            $push: {
                                notifications: {
                                    type:"rescheduled",

                                    message: `Appointment at slot ${formattedOldTime} on ${existingAppointment.date} with Dr. ${doctor.name} is rescheduled to be at ${formattedNewTime} on ${updatedAppointment.date}.`,
                                },
                            },
                        },
                        { new: true }
                    );
                    notificationMessageRegisteredPatient = `
                        Dear ${registeredPatient.name},
    
                        Your appointment has been rescheduled by Dr. ${doctor.name} to be on:
    
                        new Date: ${updatedAppointment.date}
                        new Time: ${formattedNewTime}
      
                        Thank you for choosing our service!
    
                        Best regards,
                        Your Clinic
                    `;
                    await doctorModel.findByIdAndUpdate(
                        doctor._id,
                        {
                            $push: {
                                notifications: {
                                    type:"rescheduled",
    
                                    message: `Appointment with ${registeredPatient.name} at slot ${formattedOldTime} on ${existingAppointment.date} is rescheduled to be at slot ${formattedNewTime} on ${updatedAppointment.date}.`,
                                },
                            },
                        },
                        { new: true }
                    );

                } else {

                    const patientToGO = await patientModel.findOne({ username: existingAppointment.patient_username });
                    if (patientToGO) {
                        notificationMessageDoctor = `
                        Dear Dr. ${doctor.name},

                        The following appointment has been successfully rescheduled:
    
                        Patient: ${patientToGO.name}
                        Original Appointment: ${formattedOldTime} on ${existingAppointment.date}
                        Rescheduled to: ${formattedNewTime} on ${updatedAppointment.date}
                        Status: Rescheduled
    
                        Thank you for your attention to this update.
    
                        Best regards.
                        `;


                        await patientModel.findByIdAndUpdate(
                            patientToGO._id,
                            {
                                $push: {
                                    notifications: {
                                        type:"rescheduled",
                                        message: `Appointment at slot ${formattedOldTime} on ${existingAppointment.date} with Dr. ${doctor.name} is rescheduled by the doctor to be at ${formattedNewTime} on ${updatedAppointment.date}.`,
                                    },
                                },
                            },
                            { new: true }
                        );
                        // send mail to a patient and put notification in database
                        notificationMessagePatient = `
                        Dear ${registeredPatient.name},
    
                        Your appointment that was reserved to ${patientToGO.name}
                        has been rescheduled by Dr. ${doctor.name} to be on:
    
                        new Date: ${updatedAppointment.date}
                        new Time: ${formattedNewTime}
      
                        Thank you for choosing our service!
    
                        Best regards,
                        Your Clinic
                        `;

                        // patient to get mail , email Subject , Email Text
                        await sendEmail(patientToGO.email, `Dr. ${doctor.name} appointment is rescheduled`, notificationMessagePatient);

                        // send mail to a patient and put notification in database
                        notificationMessageRegisteredPatient = `
                            Dear ${registeredPatient.name},

                            Your appointment to ${patientToGO.name} 
                            has been rescheduled by Dr.${doctor.name} to be on:

                            Date: ${updatedAppointment.date}
                            Time: ${formattedNewTime}
  
                            Thank you for choosing our service!

                            Best regards,
                            Your Clinic
                        `;
                        await doctorModel.findByIdAndUpdate(
                            doctor._id,
                            {
                                $push: {
                                    notifications: {
                                        type:"rescheduled",
        
                                        message: `Appointment with ${patientToGO.name} at slot ${formattedOldTime} on ${existingAppointment.date} is rescheduled to be at slot ${formattedNewTime} on ${updatedAppointment.date}.`,
                                    },
                                },
                            },
                            { new: true }
                        );
                    }
                    else {
                        await doctorModel.findByIdAndUpdate(
                            doctor._id,
                            {
                                $push: {
                                    notifications: {
                                        type:"rescheduled",
        
                                        message: `Appointment with ${updatedAppointment.name} at slot ${formattedOldTime} on ${existingAppointment.date} is rescheduled to be at slot ${formattedNewTime} on ${updatedAppointment.date}.`,
                                    },
                                },
                            },
                            { new: true }
                        );
                        notificationMessageDoctor = `
                        Dear Dr. ${doctor.name},

                        The following appointment has been successfully rescheduled:

                        Patient: ${existingAppointment.name}
                        Original Appointment: ${formattedOldTime} on ${existingAppointment.date}
                        Rescheduled to: ${formattedNewTime} on ${updatedAppointment.date}
                        Status: Rescheduled

                        Thank you for your attention to this update.

                        Best regards.
                    `;

                    }
                }

                // patient to get mail , email Subject , Email Text
                await sendEmail(registeredPatient.email, `Dr. ${doctor.name} appointment is rescheduled`, notificationMessageRegisteredPatient);

                // doctor to get mail , email Subject , Email Text
                await sendEmail(doctor.email, 'The appointment is rescheduled successfully', notificationMessageDoctor);


    res.status(200).json({ message: 'Success', rescheduledAppointment: true, updatedAppointment });
});



const cancelAppointment = asyncHandler(async (req, res) => {
    const { appointmentID } = req.body;

    if (!appointmentID) {
        res.status(400).json({ message: 'Please provide appointment ID', canceledAppointment: false });
        return;
    }

    const existingAppointment = await appointmentModel.findById(appointmentID);

    if (!existingAppointment) {
        res.status(404).json({ message: 'Appointment not found', canceledAppointment: false });
        return;
    }

    //Logy added
      
    const doctor = await doctorModel.findOne({ username: existingAppointment.doctor_username });
    const registeredPatient = await patientModel.findOne({ username: existingAppointment.booked_by});

    // Cancelled before 24 hours , so refund
    existingAppointment.status = 'canceled';

    const refund = existingAppointment.price;

    // Update patient's wallet balance (assuming you have a Patient model with a walletBalance field)
    try {
        const patient = await patientModel.findOne({ username: existingAppointment.booked_by });
        console.log("Before : ", patient.walletAmount);
        if (!patient) {
            throw new Error('Patient not found');
        }
        const newWalletBalance = patient.walletAmount + refund;
        // Update the patient's wallet balance
        patient.walletAmount = newWalletBalance;

        // Save the updated patient information
        await patient.save();
        console.log("After : ", patient.walletAmount);
        console.log(`Refunded ${existingAppointment.price} to patient's wallet. New wallet balance: ${patient.walletAmount}`);
    } catch (error) {
        console.error(`Error refunding to patient's wallet: ${error.message}`);
    }
    await existingAppointment.save();

    //Added by Logy
    const formattedOldTime = new Date(existingAppointment.time).toLocaleTimeString();
        
    let notificationMessageDoctor;
    let notificationMessageRegisteredPatient;


    if (req.body.patientUsername === req.body.bookedUsername) {
        //console.log("enter if,")
        notificationMessageDoctor = `
        Dear Dr. ${doctor.name},

        The following appointment has been successfully cancelled:

        Patient: ${registeredPatient.name}
        Appointment: ${formattedOldTime} on ${existingAppointment.date}
        Status: Rescheduled

        Thank you for your attention to this update.

        Best regards.
       `;

        await patientModel.findByIdAndUpdate(
            registeredPatient._id,
            {
                $push: {
                    notifications: {
                        type:"cancelled",

                        message: `Appointment at slot ${formattedOldTime} on ${existingAppointment.date} with Dr. ${doctor.name} is cancelled.`,
                    },
                },
            },
            { new: true }
        );
        notificationMessageRegisteredPatient = `
        Dear ${registeredPatient.name},

        We regret to inform you that your appointment with Dr. ${doctor.name}
        at ${formattedOldTime} on ${existingAppointment.date} has been canceled.
        
        Thank you for choosing our service.
        
        Best regards,
        Your Clinic
        `;
        await doctorModel.findByIdAndUpdate(
            doctor._id,
            {
                $push: {
                    notifications: {
                        type:"cancelled",

                        message: `Appointment with ${registeredPatient.name} at slot ${formattedOldTime} on ${existingAppointment.date} is cancelled.`,
                    },
                },
            },
            { new: true }
        );

    } else {

        const patientToGO = await patientModel.findOne({ username: existingAppointment.patient_username });
        if (patientToGO) {
            notificationMessageDoctor = `
            Dear Dr. ${doctor.name},

            The following appointment has been successfully cancelled:
    
            Patient: ${patientToGO.name}
            Appointment: ${formattedOldTime} on ${existingAppointment.date}
            Status: Rescheduled
    
            Thank you for your attention to this update.
    
            Best regards.
            `;


            await patientModel.findByIdAndUpdate(
                patientToGO._id,
                {
                    $push: {
                        notifications: {
                            type:"cancelled",
                            message: `Appointment at slot ${formattedOldTime} on ${existingAppointment.date} with Dr. ${doctor.name} is cancelled.`,
                        },
                    },
                },
                { new: true }
            );
            // send mail to a patient and put notification in database
            notificationMessagePatient = `
            Dear ${patientToGO.name},

            We regret to inform you that your appointment with Dr. ${doctor.name} 
            at ${formattedOldTime} on ${existingAppointment.date} has been canceled.
            
            Thank you for choosing our service.
            
            Best regards,
            Your Clinic
            `;

            // patient to get mail , email Subject , Email Text
            await sendEmail(patientToGO.email, `Dr. ${doctor.name} cancelled appointment`, notificationMessagePatient);

            // send mail to a patient and put notification in database
            notificationMessageRegisteredPatient = `
                Dear ${registeredPatient.name},

                Your appointment to ${patientToGO.name} with DR. ${doctor.name}
                at ${formattedOldTime} on ${existingAppointment.date} 
                has been cancelled.

                Thank you for choosing our service!

                Best regards,
                Your Clinic
            `;
            await doctorModel.findByIdAndUpdate(
                doctor._id,
                {
                    $push: {
                        notifications: {
                            type:"cancelled",

                            message: `Appointment with ${patientToGO.name} at slot ${formattedOldTime} on ${existingAppointment.date} has been cancelled successfully.`,
                        },
                    },
                },
                { new: true }
            );
        }
        else {
            await doctorModel.findByIdAndUpdate(
                doctor._id,
                {
                    $push: {
                        notifications: {
                            type:"cancelled",

                            message: `Appointment with ${existingAppointment.name} at slot ${formattedOldTime} on ${existingAppointment.date} has been cancelled successfully`,
                        },
                    },
                },
                { new: true }
            );
            notificationMessageDoctor = `
            Dear Dr. ${doctor.name},

            The following appointment has been successfully cancelled:
    
            Patient: ${existingAppointment.name}
            Appointment: ${formattedOldTime} on ${existingAppointment.date}
            Status: Rescheduled
    
            Thank you for your attention to this update.
    
            Best regards.
        `;

        }
    }

    // patient to get mail , email Subject , Email Text
    await sendEmail(registeredPatient.email, `DR. ${doctor.name} appointment is cancelled`, notificationMessageRegisteredPatient);

    // doctor to get mail , email Subject , Email Text
    await sendEmail(doctor.email, 'The appointment is cancelled', notificationMessageDoctor);



    res.status(200).json({ message: 'Success', canceledAppointment: true, refundAmount: refund });
});

module.exports = { getAppointments,getUpcomingAppointments, getPastAppointments, scheduleFollowUpAppointment, getScheduledFollowUp, rescheduleAppointment, getPastAppointmentsFollowUp, cancelAppointment };