const asyncHandler = require('express-async-handler');
const patients = require('../../../models/Patient');
const doctors = require('../../../models/Doctor');
const appointmentModel = require('../../../models/Appointment');
const { default: mongoose } = require('mongoose');
const contract = require('../../../models/Contract');
const { sendEmail } = require('./emailHelper');

const payAppointment = asyncHandler(async (req, res) => {

    const registeredPatient = await patients.findOne({ username: req.body.bookedUsername });
    const doctorToPay = await doctors.findOne({ username: req.body.doctorUsername });
    const doctorContract = await contract.findOne({username: req.body.doctorUsername});

    const totalAmount = req.body.appointmentPrice;

    if (registeredPatient) {

        const patientWallet = registeredPatient.walletAmount;
        if (totalAmount > patientWallet) {

            return res.status(400).json({ message: ' No Sufficient Funds in the wallet! ', success: false })
        }
        if (totalAmount <= patientWallet) {


            const appointmentTimeAsString = new Date(req.body.appointmentSlot).toISOString();


            // check that appointment is still available
            let flag = true;
            if (doctorToPay.availableTimeSlots.length === 0) {
                flag = false;

            }
            else {

                const checkIfSlotIsStillAvailable = () => {
                    for (const slot of doctorToPay.availableTimeSlots) {

                        const slotAsString = new Date(slot).toISOString();
                        console.log(slotAsString === appointmentTimeAsString)
                        if (slotAsString === appointmentTimeAsString) {
                            return true;
                        }
                    }
                    return false;
                }
                flag = checkIfSlotIsStillAvailable();
            }

            if (!flag) {
                // const removeAppointment = await appointment.findOneAndDelete({ _id: new mongoose.Types.ObjectId(req.body.rowId) });
                return res.status(400).json({ message: 'Appointment is already booked', success: false });
            }

            // Remove the selected slot from doctor appointments
            const remainingTimeSlots = doctorToPay.availableTimeSlots.filter(slot => {
                const slotAsString = new Date(slot).toISOString();
                //console.log(slotAsString === appointmentTimeAsString)

                return slotAsString !== appointmentTimeAsString;
            });

            const updatedDoctorSlots = await doctors.findOneAndUpdate({ username: req.body.doctorUsername }, { $push: { availableTimeSlots: req.body.appointmentSlot } }, { new: true });

            // console.log('Available Time Slots After:', remainingTimeSlots);

            doctorToPay.availableTimeSlots = remainingTimeSlots;

            await doctorToPay.save();

            const newWalletAmout = patientWallet - totalAmount;
    
            const doctorAmount = doctorToPay.walletAmount + [1-(doctorContract.markupRate/100)] * totalAmount;
            const updatedPatient = await patients.findOneAndUpdate({ username: req.body.bookedUsername }, { walletAmount: newWalletAmout });
         
            const updatedDoctorWallet = await doctors.findOneAndUpdate({ username: req.body.doctorUsername }, { walletAmount: doctorAmount });
            const appointment = {
                patient_username: req.body.patientUsername,
                doctor_username: req.body.doctorUsername,
                date: req.body.appointmentDate,
                status: 'upcoming',
                time: req.body.appointmentSlot,
                name: req.body.name,
                price: req.body.appointmentPrice,
                booked_by: req.body.bookedUsername,


            };

            const newAppointment = await appointmentModel.create(appointment);
            const formattedTime = new Date(appointment.time).toLocaleTimeString();

            let notificationMessageDoctor;
                let notificationMessageRegisteredPatient;


                if (req.body.patientUsername === req.body.bookedUsername) {
                    //console.log("enter if,")
                    notificationMessageDoctor = `
                        New Appointment Reserved:
                 
                        Patient Name: ${registeredPatient.name}
                        Date: ${appointment.date}
                        Time: ${formattedTime}
                        Status: Reserved
                   `;

                    await patients.findByIdAndUpdate(
                        registeredPatient._id,
                        {
                            $push: {
                                notifications: {
                                    type:"new",

                                    message: `Appointment at slot ${formattedTime} on ${appointment.date} with Dr. ${doctorToPay.name} is reserved  `,
                                },
                            },
                        },
                        { new: true }
                    );
                    notificationMessageRegisteredPatient = `
                        Dear ${registeredPatient.name},
    
                        Your appointment has been successfully reserved:
    
                        Date: ${appointment.date}
                        Time: ${formattedTime}
                        Doctor: ${doctorToPay.name}
      
                        Thank you for choosing our service!
    
                        Best regards,
                        Your Clinic
                    `;

                } else {

                    const patientToGO = await patients.findOne({ username: req.body.patientUsername });
                    if (patientToGO) {
                        notificationMessageDoctor = `
                            New Appointment Reserved:
                 
                            Patient Name: ${patientToGO.name}
                            Date: ${appointment.date}
                            Time: ${formattedTime}
                            Status: Reserved
                        `;


                        await patients.findByIdAndUpdate(
                            patientToGO._id,
                            {
                                $push: {
                                    notifications: {
                                        type:"new",
                                        message: `Appointment at slot ${formattedTime} on ${appointment.date} with Dr. ${doctorToPay.name} is reserved by ${registeredPatient.name}  `,
                                    },
                                },
                            },
                            { new: true }
                        );
                        // send mail to a patient and put notification in database
                        notificationMessagePatient = `
                            Dear ${patientToGO.name},
  
                            Your appointment has been successfully reserved by ${registeredPatient.name} 
                        
                            Appointment Details:
  
                            Date: ${appointment.date}
                            Time: ${formattedTime}
                            Doctor: ${doctorToPay.name}
    
                            Thank you for choosing our service!
  
                            Best regards,
                            Your Clinic
                        `;

                        // patient to get mail , email Subject , Email Text
                        await sendEmail(patientToGO.email, ' New Appointment Reservation', notificationMessagePatient);

                        // send mail to a patient and put notification in database
                        notificationMessageRegisteredPatient = `
                            Dear ${registeredPatient.name},

                            Your appointment to ${patientToGO.name} has been successfully reserved:

                            Date: ${appointment.date}
                            Time: ${formattedTime}
                            Doctor: ${doctorToPay.name}
  
                            Thank you for choosing our service!

                            Best regards,
                            Your Clinic
                        `;
                    }
                    else {
                        notificationMessageDoctor = `
                        New Appointment Reserved:
             
                        Patient Name: ${req.body.name}
                        Date: ${appointment.date}
                        Time: ${formattedTime}
                        Status: Reserved
                    `;

                    }
                }

                // patient to get mail , email Subject , Email Text
                await sendEmail(registeredPatient.email, ' New Appointment Reservation', notificationMessageRegisteredPatient);

                // doctor to get mail , email Subject , Email Text
                await sendEmail(doctorToPay.email, ' New Appointment Reservation', notificationMessageDoctor);

                await doctors.findByIdAndUpdate(
                    doctorToPay._id,
                    {
                        $push: {
                            notifications: {
                                type:"new",

                                message: `New appointment at slot ${formattedTime} on ${appointment.date} is reserved  `,
                            },
                        },
                    },
                    { new: true }
                );
            return res.status(201).json({ message: ' Payment done', success: true });

        }
        else {

            return res.status(400).json({ message: ' Patient not found', success: false });
        }
    }
})


module.exports = { payAppointment };
