const asyncHandler = require('express-async-handler');
const patients = require('../../../models/Patient');
const doctors = require('../../../models/Doctor');
const appointmentModel = require('../../../models/Appointment');
const { default: mongoose } = require('mongoose');
const contract = require('../../../models/Contract');
const { sendEmail } = require('./emailHelper');



const stripe = require('stripe')(process.env.STRIPE_PRIV_KEY);


const payAppointment = asyncHandler(async (req, res) => {
    // console.log("req.body",req.body);

    try {

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',

            line_items: [{
                price_data: {
                    currency: 'USD',
                    product_data: {
                        name: 'Appointment Price: '
                    },

                    unit_amount: req.body.appointmentPrice * 100
                },
                quantity: 1
            },
            ],

            success_url: 'http://localhost:5173/patient/successPayment',
            cancel_url: 'http://localhost:5173/patient/unsuccessPayment'  // will change it
        })
        const registeredPatient = await patients.findOne({ username: req.body.bookedUsername });
        const doctorToPay = await doctors.findOne({ username: req.body.doctorUsername });
        const doctorContract = await contract.findOne({username: req.body.doctorUsername});

        const totalAmount = req.body.appointmentPrice;
        //console.log("req.body.appointmentPrice: ",req.body.appointmentPrice);

        if (registeredPatient) {
            // console.log(registeredPatient);

            // console.log('Available Time Slots Before:', doctorToPay.availableTimeSlots);

            const appointmentTimeAsString = new Date(req.body.appointmentSlot).toISOString();

            // check
            let flag = true;
            if (doctorToPay.availableTimeSlots.length === 0) {
                flag = false;

            }
            else {
                const checkIfSlotIsStillAvailable = () => {
                    for (const slot of doctorToPay.availableTimeSlots) {

                        const slotAsString = new Date(slot).toISOString();
                        if (slotAsString === appointmentTimeAsString) {
                            return true;
                        }
                    }
                    return false;
                }
                flag = checkIfSlotIsStillAvailable();
            }
            // console.log("Flag: ", flag);

            if (!flag) {
                // const removeAppointment = await appointment.findOneAndDelete({ _id: new mongoose.Types.ObjectId(req.body.rowId) });
                return res.status(400).json({ message: 'Appointment is unfortunately booked! ', success: false });
            }
            else {

                // Remove the selected slot
                const remainingTimeSlots = doctorToPay.availableTimeSlots.filter(slot => {
                    const slotAsString = new Date(slot).toISOString();
                    return slotAsString !== appointmentTimeAsString;
                });

                const updatedDoctorSlots = await doctors.findOneAndUpdate({ username: req.body.doctorUsername }, { $push: { availableTimeSlots: req.body.appointmentSlot } }, { new: true });

                // console.log('Available Time Slots After:', remainingTimeSlots);

                doctorToPay.availableTimeSlots = remainingTimeSlots;


                await doctorToPay.save();

                const doctorAmount = doctorToPay.walletAmount + [1-(doctorContract.markupRate/100)] * totalAmount;
                const updatedDoctorWallet = await doctors.findOneAndUpdate({ username: req.body.doctorUsername }, { walletAmount: doctorAmount });
                //console.log('req.body.appointmentPrice',req.body.appointmentPrice);
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
                        await patients.findByIdAndUpdate(
                            registeredPatient._id,
                            {
                                $push: {
                                    notifications: {
                                        type:"new",
        
                                        message: `Appointment to ${appointment.name} at slot ${formattedTime} on ${appointment.date} with DR. ${doctorToPay.name} is reserved.`,
                                    },
                                },
                            },
                            { new: true }
                        );
                        
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
            
                return res.status(201).json({ success: true, url: session.url, successURL: session.success_url });
            }
        }
    } catch (error) {
        // Respond with an error message if there is an error
        return res.status(500).json({ success: false, error: 'An error occurred while creating the session.' });
    }
})

module.exports = { payAppointment };