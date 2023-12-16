const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');
const patientModel = require('../../models/Patient');
const doctorModel = require('../../models/Doctor');
const appointmentModel = require('../../models/Appointment');
const subsPackageModel = require('../../models/SubscribedPackages');
const packageModel = require('../../models/Package');
const linkedFamilyModel = require('../../models/LinkedFamily');
const familyModel = require('../../models/Family');
const { sendEmail } = require('../patient/payments/emailHelper');
const followUpModel = require('../../models/FollowUp');



// Add a new appointment to the database
const createAppointment = asyncHandler(async (req, res) => {
    const appointment = req.body;

    if (appointment.doctor_username === undefined || appointment.patient_username === undefined || appointment.date === undefined || appointment.time == undefined
        || appointment.name == undefined || appointment.price == undefined || appointment.booked_by == undefined) {
        res.status(400).json({ message: 'Please provide doctor username, patient username, and appointment date', createdAppointment: false });
        return;
    }

    const doctor = await doctorModel.findOne({ username: appointment.doctor_username });
    const patient = await patientModel.findOne({ username: appointment.patient_username });

    if (!doctor) {
        res.status(400).json({ message: 'Doctor not found', createdAppointment: false });
        return;
    }

    /*
    if (!patient) {
        res.status(400).json({ message: 'Patient not found', createdAppointment: false });
        return;
    }
    */

    const appointmentDate = new Date(appointment.date);
    const currentDate = new Date().toLocaleDateString('en-GB');

    if (appointmentDate < currentDate) {
        res.status(400).json({ message: 'Appointment date is in the past', createdAppointment: false });
        return;
    }

    appointment.status = "upcoming";

    const newAppointment = await appointmentModel.create(appointment);

    console.log(typeof appointment.time);
    console.log('Appointment time', appointment.time);

    console.log('Available Time Slots Before:', doctor.availableTimeSlots);

    // const appointmentTimeAsString = new Date(appointment.time).toISOString();

    // const remainingTimeSlots = doctor.availableTimeSlots.filter(slot => {
    //     const slotAsString = new Date(slot).toISOString();
    //     return slotAsString !== appointmentTimeAsString;
    // });

    // console.log('Available Time Slots After:', remainingTimeSlots);

    // doctor.availableTimeSlots = remainingTimeSlots;

    // console.log("At tarnem: ",doctor.availableTimeSlots)
    // await doctor.save();

    console.log(newAppointment)
    console.log(newAppointment._id)

    res.status(200).json({ message: 'Success', appointment: newAppointment, createdAppointment: true, rowAppointmentID: newAppointment._id });
});


// Get Upcoming appointments
const getUpcomingAppointments = asyncHandler(async (req, res) => {
    const patient = await patientModel.findOne({
        username: req.body.username,
    });
    if (!patient) {
        return res.status(404).json('No');
    }
    const upcomingAppointments = await appointmentModel.find({ patient_username: patient.username, status: "upcoming" });
    res.status(200).json(upcomingAppointments);
});

// Get Completed (Past) Appointments 
const getPastAppointments = asyncHandler(async (req, res) => {
    const patient = await patientModel.findOne({
        username: req.body.username,
    });
    if (!patient) {
        return res.status(404).json('No');
    }
    const upcomingAppointments = await appointmentModel.find({ patient_username: patient.username, status: "completed" });
    res.status(200).json(upcomingAppointments);
});

const getPatientByUsername = async (req, res) => {
    const patientUsername = req.query.patient_username;

    try {
        // Search in patientModel
        const patient = await patientModel.findOne({ username: patientUsername });

        // If patient is not found in patientModel, search in familyMemberSchema
        if (!patient) {
            const familyMember = await familyModel.findOne({ national_id: patientUsername });

            // If patient is not found in familyMemberSchema, search in linkedFamilyMember with schema
            if (!familyMember) {
                const linkedFamilyMember = await linkedFamilyModel.findOne({ username: patientUsername });

                if (linkedFamilyMember) {
                    // Return linkedFamilyMember details
                    res.status(200).json(linkedFamilyMember);
                } else {
                    res.status(404).json({ message: 'Patient not found' });
                }
            } else {
                // Return familyMember details
                res.status(200).json(familyMember);
            }
        } else {
            // Return patient details
            res.status(200).json(patient);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const getHourlyRateByUsername = async (req, res) => {
    const patientUsername = req.query.patient_username;
    //console.log("Patient", patientUsername)
    const doctorUsername = req.query.doctor_username;
    //console.log("Doctor", doctorUsername)

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set the time to the beginning of the day

    const isSubs = await subsPackageModel
        .find({
            patient_username: patientUsername,
            status: { $in: ['subscribed', 'cancelled'] },
            end_date: { $gte: today }
        })
        .sort({ start_date: -1 })
        .limit(1);

    //console.log(isSubs)
    //console.log(isSubs.length)
    // All doctors
    let patient_hourlyRate = 0; // Initialize with a default value
    let price_before = 0; 
    let package_discount = 0;

    if (isSubs.length > 0) { // Check the length of the array
        const package_name = isSubs[0].package_name;
        const packageData = await packageModel.findOne({ name: package_name });
        package_discount = packageData ? packageData.doctor_discount : 0;

        const doctor_hourlyRate = await doctorModel.findOne({ username: doctorUsername }).select('hourly_rate');
        price_before = doctor_hourlyRate.hourly_rate + doctor_hourlyRate.hourly_rate * 0.1;
        patient_hourlyRate = (doctor_hourlyRate.hourly_rate + (doctor_hourlyRate.hourly_rate * 0.1)) - ((packageData.doctor_discount / 100.0) * doctor_hourlyRate.hourly_rate)
    } else {


        const doctor_hourlyRate = await doctorModel.findOne({ username: doctorUsername }).select('hourly_rate');
        price_before = doctor_hourlyRate.hourly_rate + doctor_hourlyRate.hourly_rate * 0.1;
        patient_hourlyRate = doctor_hourlyRate.hourly_rate + doctor_hourlyRate.hourly_rate * 0.1
    }

    console.log("Hourly", patient_hourlyRate);

    //console.log(res.status(200).json(patient_hourlyRate))
    
    res.status(200).json({
        package_discount : package_discount,
        patient_hourlyRate: patient_hourlyRate,
        price_before: price_before
    });
}

const getHourlyRateByNationalID = async (req, res) => {
    const patientUsername = req.query.nationalID;
    console.log("Patient", patientUsername)
    const doctorUsername = req.query.doctor_username;
    console.log("Doctor", doctorUsername)

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set the time to the beginning of the day

    const isSubs = await subsPackageModel
        .find({
            patient_username: patientUsername,
            status: { $in: ['subscribed', 'cancelled'] },
            end_date: { $gte: today }
        })
        .sort({ start_date: -1 })
        .limit(1);

    let patient_hourlyRate = 0; 
    let price_before = 0;
    let package_discount = 0;

    if (isSubs.length > 0) { // Check the length of the array
        const package_name = isSubs[0].package_name;
        const packageData = await packageModel.findOne({ name: package_name });
        package_discount = packageData ? packageData.doctor_discount : 0;

        const doctor_hourlyRate = await doctorModel.findOne({ username: doctorUsername }).select('hourly_rate');
        price_before = doctor_hourlyRate.hourly_rate + doctor_hourlyRate.hourly_rate * 0.1;
        patient_hourlyRate = (doctor_hourlyRate.hourly_rate + (doctor_hourlyRate.hourly_rate * 0.1)) - ((packageData.doctor_discount / 100.0) * doctor_hourlyRate.hourly_rate)
    } else {
        const doctor_hourlyRate = await doctorModel.findOne({ username: doctorUsername }).select('hourly_rate');
        price_before = doctor_hourlyRate.hourly_rate + doctor_hourlyRate.hourly_rate * 0.1;
        patient_hourlyRate = doctor_hourlyRate.hourly_rate + doctor_hourlyRate.hourly_rate * 0.1;
    }

    res.status(200).json({
        package_discount : package_discount,
        patient_hourlyRate: patient_hourlyRate,
        price_before: price_before
    });
}

// Get all appointments booked by me
const getBookedAppointments = asyncHandler(async (req, res) => {
    const currentUser = req.body.username;
    //console.log(currentUser)
    const bookedAppointments = await appointmentModel.find({ booked_by: currentUser ,patient_username: { $ne: currentUser } })
    //console.log(bookedAppointments)
    res.status(200).json(bookedAppointments);
})

// Get all appointments
const getAppointments = asyncHandler(async (req, res) => {
    const patient = await patientModel.findOne({
        username: req.body.username,
    });
    const appointments = await appointmentModel.find({patient_username: patient.username});
    res.status(200).json(appointments);
});

const getFollowUpAppointments = asyncHandler(async (req, res) => {
    const patient = await patientModel.findOne({
        username: req.body.username,
    });
    const appointments = await followUpModel.find({patient_username: patient.username});
    res.status(200).json(appointments);
});

// Get appointment by ID
const getAppointmentById = asyncHandler(async (req, res) => {
    const id = req.query.appointment_id;
    const appointment = await appointmentModel.findById(id);

    if (!appointment) {
        res.status(404).json({ message: 'Appointment not found' });
    } else {
        res.status(200).json(appointment);
    }
});


// Reschedule an appointment
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
    const doctor = await doctorModel.findOne({ username: existingAppointment.doctor_username });

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


    // Adding the time slot to be available again to that doctor
    //console.log("Before",doctor.availableTimeSlots)
    // Adding the time slot to be available again to that doctor
    const rescheduledAppointmentTime = new Date(existingAppointment.time); // Assuming newTime is a valid DateTime string

    if (!doctor.availableTimeSlots.some(slot => slot.getTime() === rescheduledAppointmentTime.getTime())) {
        // Check if the time slot is not already in the array before adding it
        doctor.availableTimeSlots.push(rescheduledAppointmentTime);
    }

    const newTimeAsDate = new Date(newTime);

    const remainingTimeSlots = doctor.availableTimeSlots.filter(slot => {
        return slot.getTime() !== newTimeAsDate.getTime();
    });

    console.log('Available Time Slots After:', remainingTimeSlots);

    doctor.availableTimeSlots = remainingTimeSlots;
    console.log("After", doctor.availableTimeSlots);
    await doctor.save();

    //Added by Logy
    const formattedOldTime = new Date(existingAppointment.time).toLocaleTimeString();
    const formattedNewTime = new Date(updatedAppointment.time).toLocaleTimeString();

                let notificationMessageDoctor;
                let notificationMessageRegisteredPatient;
                
                if (existingAppointment.patient_username === existingAppointment.doctor_username) {
                    //console.log("enter if,")
                    notificationMessageDoctor = `
                    Appointment Update:
                    Patient: ${registeredPatient.name}
                    Original Appointment: ${formattedOldTime} on ${existingAppointment.date}
                    Rescheduled to: ${formattedNewTime} on ${updatedAppointment.date}
                    Status: Rescheduled
                   `;

                    await patientModel.findByIdAndUpdate(
                        registeredPatient._id,
                        {
                            $push: {
                                notifications: {
                                    type:"rescheduled",

                                    message: `Appointment at slot ${formattedOldTime} on ${existingAppointment.date} with Dr. ${doctor.name} is rescheduled successfully to be at ${formattedNewTime} on ${updatedAppointment.date}.`,
                                },
                            },
                        },
                        { new: true }
                    );
                    notificationMessageRegisteredPatient = `
                        Dear ${registeredPatient.name},
    
                        Your appointment has been successfully rescheduled to be on:
    
                        new Date: ${updatedAppointment.date}
                        new Time: ${formattedNewTime}
                        Doctor: ${doctor.name}
      
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
                        Appointment Update:
                        Patient: ${patientToGO.name}
                        Original Appointment: ${formattedOldTime} on ${existingAppointment.date}
                        Rescheduled to: ${formattedNewTime} on ${updatedAppointment.date}
                        Status: Rescheduled
                        `;


                        await patientModel.findByIdAndUpdate(
                            patientToGO._id,
                            {
                                $push: {
                                    notifications: {
                                        type:"rescheduled",
                                        message: `Appointment at slot ${formattedOldTime} on ${existingAppointment.date} with Dr. ${doctor.name} is rescheduled by ${registeredPatient.name} to be at ${formattedNewTime} on ${updatedAppointment.date}.`,
                                    },
                                },
                            },
                            { new: true }
                        );
                        // send mail to a patient and put notification in database
                        notificationMessagePatient = `
                            Dear ${patientToGO.name},
  
                            Your appointment at ${formattedOldTime} on ${existingAppointment.data} has been successfully rescheduled by ${registeredPatient.name} 
                        
                            new Appointment Details:
  
                            Date: ${updatedAppointment.date}
                            Time: ${formattedNewTime}
                            Doctor: ${doctor.name}
    
                            Thank you for choosing our service!
  
                            Best regards,
                            Your Clinic
                        `;

                        // patient to get mail , email Subject , Email Text
                        await sendEmail(patientToGO.email, 'Appointment Rescheduled', notificationMessagePatient);

                        // send mail to a patient and put notification in database
                        notificationMessageRegisteredPatient = `
                            Dear ${registeredPatient.name},

                            Your appointment to ${patientToGO.name} has been successfully rescheduled to be on:

                            Date: ${updatedAppointment.date}
                            Time: ${formattedNewTime}
                            Doctor: ${doctor.name}
  
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
        
                                        message: `Appointment with ${existingAppointment.name} at slot ${formattedOldTime} on ${existingAppointment.date} is rescheduled to be at slot ${formattedNewTime} on ${updatedAppointment.date}.`,
                                    },
                                },
                            },
                            { new: true }
                        );
                        await patientModel.findByIdAndUpdate(
                            registeredPatient._id,
                            {
                                $push: {
                                    notifications: {
                                        type:"rescheduled",
            
                                        message: `Appointment to ${existingAppointment.name} at slot ${formattedOldTime} on ${existingAppointment.date} with DR. ${doctor.name} is rescheduled.`,
                                    },
                                },
                            },
                            { new: true }
                        );
                        console.log('name',updatedAppointment);
                        notificationMessageDoctor = `
                        Appointment is rescheduled to be on:
             
                        Patient Name: ${existingAppointment.name}
                        Date: ${updatedAppointment.date}
                        Time: ${formattedNewTime}
                        Status: Rescheduled
                    `;
                    }
                }

                // patient to get mail , email Subject , Email Text
                await sendEmail(registeredPatient.email, 'The Appointment is rescheduled successfully ', notificationMessageRegisteredPatient);

                // doctor to get mail , email Subject , Email Text
                await sendEmail(doctor.email, 'An appointment is rescheduled', notificationMessageDoctor);

                // await doctorModel.findByIdAndUpdate(
                //     doctor._id,
                //     {
                //         $push: {
                //             notifications: {
                //                 type:"rescheduled",

                //                 message: `Appointment with ${registeredPatient.name} at slot ${formattedOldTime} on ${existingAppointment.date} is rescheduled to be at slot ${formattedNewTime} on ${updatedAppointment.date}.`,
                //             },
                //         },
                //     },
                //     { new: true }
                // );


    res.status(200).json({ message: 'Success', rescheduledAppointment: true, updatedAppointment });

});


// Cancel an appointment
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
    const registeredPatient = await patientModel.findOne({ username: existingAppointment.booked_by});

    const currentDate = new Date();
    const appointmentDate = new Date(existingAppointment.time);
    const doctor = await doctorModel.findOne({ username: existingAppointment.doctor_username });

    // Calculating the difference in hours between the current date and the appointment date to check if they are less or more than 24 hours for the refund.
    const hoursDifference = Math.floor((appointmentDate - currentDate) / (60 * 60 * 1000));
    let refund = 0;
    if (hoursDifference <= 24) {
        existingAppointment.status = 'canceled';

        refund = 0;
    } else {
        // Cancelled before 24 hours , so refund
        existingAppointment.status = 'canceled';

        refund = existingAppointment.price;

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
    }

    await existingAppointment.save();

    // Adding the time slot to be available again to that doctor
    //console.log("Before",doctor.availableTimeSlots)
    const canceledAppointmentTime = new Date(existingAppointment.time);
    doctor.availableTimeSlots.push(canceledAppointmentTime);
    //console.log("After", doctor.availableTimeSlots);
    await doctor.save();


        //Added by Logy
        const formattedOldTime = new Date(existingAppointment.time).toLocaleTimeString();
        
                    let notificationMessageDoctor;
                    let notificationMessageRegisteredPatient;
    
    
                    if (existingAppointment.patient_username === existingAppointment.doctor_username) {
                        //console.log("enter if,")
                        notificationMessageDoctor = `
                        Appointment with ${registeredPatient.name} has been cancelled.
                        Appointment Slot: ${formattedOldTime} on ${existingAppointment.date}
                        Status: Cancelled
                       `;
    
                        await patientModel.findByIdAndUpdate(
                            registeredPatient._id,
                            {
                                $push: {
                                    notifications: {
                                        type:"cancelled",
    
                                        message: `Appointment at slot ${formattedOldTime} on ${existingAppointment.date} with Dr. ${doctor.name} is cancelled successfully.`,
                                    },
                                },
                            },
                            { new: true }
                        );
                        notificationMessageRegisteredPatient = `
                            Dear ${registeredPatient.name},
        
                            Your appointment with ${doctor.name}
                            at ${formattedOldTime} on ${existingAppointment.date} 
                            has been successfully cancelled.
        
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
                            Appointment with ${patientToGO.name} has been cancelled.
                            Appointment Slot: ${formattedOldTime} on ${existingAppointment.date}
                            Status: Cancelled
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
        
                            Your appointment with ${doctor.name}
                            at ${formattedOldTime} on ${existingAppointment.date} 
                            has been cancelled by ${registeredPatient.name}.
        
                            Thank you for choosing our service!
        
                            Best regards,
                            Your Clinic
                            `;
    
                            // patient to get mail , email Subject , Email Text
                            await sendEmail(patientToGO.email, `An appointment Cancelled by ${registeredPatient.name}`, notificationMessagePatient);
    
                            // send mail to a patient and put notification in database
                            notificationMessageRegisteredPatient = `
                                Dear ${registeredPatient.name},
    
                                Your appointment to ${patientToGO.name} with DR. ${doctor.name}
                                at ${formattedOldTime} on ${existingAppointment.date} 
                                has been cancelled successfully.
      
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
            
                                            message: `Appointment with ${patientToGO.name} at slot ${formattedOldTime} on ${existingAppointment.date} is cancelled.`,
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
            
                                            message: `Appointment with ${existingAppointment.name} at slot ${formattedOldTime} on ${existingAppointment.date} is cancelled.`,
                                        },
                                    },
                                },
                                { new: true }
                            );
                            await patientModel.findByIdAndUpdate(
                                registeredPatient._id,
                                {
                                    $push: {
                                        notifications: {
                                            type:"cancelled",
                
                                            message: `Appointment to ${existingAppointment.name} at slot ${formattedOldTime} on ${existingAppointment.date} with DR. ${doctor.name} is cancelled.`,
                                        },
                                    },
                                },
                                { new: true }
                            );
                            notificationMessageDoctor = `
                            The appointment with ${existingAppointment.name}
                            at ${formattedOldTime} on ${existingAppointment.date}
                            is cancelled. 
                            Status: Cancelled
                        `;
    
                        }
                    }
    
                    // patient to get mail , email Subject , Email Text
                    await sendEmail(registeredPatient.email, 'The Appointment is cancelled successfully ', notificationMessageRegisteredPatient);
    
                    // doctor to get mail , email Subject , Email Text
                    await sendEmail(doctor.email, 'An appointment is cancelled', notificationMessageDoctor);


    res.status(200).json({ message: 'Success', canceledAppointment: true, refundAmount: refund });
});





module.exports = { createAppointment,getFollowUpAppointments, getAppointments, getUpcomingAppointments,getPatientByUsername, getPastAppointments, getBookedAppointments, getAppointmentById, getHourlyRateByUsername, getHourlyRateByNationalID, rescheduleAppointment, cancelAppointment };