const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');
const appointmentModel = require('../../models/Appointment.js');
const doctorModel = require('../../models/Doctor.js')
const followUpModel = require('../../models/FollowUp.js')
const patientModel = require('../../models/Patient.js')

const viewAppointments = async (req, res) => {
    try {
        const appointments = await appointmentModel.find();
        res.status(200).json(appointments);
    } catch (error) {
        res.status(500).json({ error: "Can't get your appoinntments" });
    }
}

const getUpcomingAppointments = asyncHandler( async (req, res) => 
{
    const doctor = await doctorModel.findOne({
        username: req.body.username,
    });
    if (!doctor) {
        return res.status(404).json('ss');
    }
    const upcomingAppointments = await appointmentModel.find({doctor_username: doctor.username , status:"upcoming"});
    res.status(200).json(upcomingAppointments);
});

const getPastAppointments = asyncHandler( async (req, res) => 
{
    const doctor = await doctorModel.findOne({
        username: req.body.username,
    });
    if (!doctor) {
        return res.status(404).json('ss');
    }
    const upcomingAppointments = await appointmentModel.find({doctor_username: doctor.username , status:"completed"});
    res.status(200).json(upcomingAppointments);
});

/*const scheduleFollowUpAppointment = asyncHandler(async (req, res) => {
    try {
      const { patientUsername, doctorUsername, date, time } = req.body;
  
      // Validate input (add more validation if needed)
  
      // Check if the doctor exists
      const doctor = await doctorModel.findOne({ username: doctorUsername });
      if (!doctor) {
        return res.status(400).json({ message: 'Doctor not found' });
      }
  
      // Check if the patient already has an appointment at the specified time
      const existingAppointment = await appointmentModel.findOne({
        patient_username: patientUsername,
        date,
        time,
      });
  
      if (existingAppointment) {
        return res.status(400).json({ message: 'Patient already has an appointment at this time' });
      }
  
      // Create a new follow-up appointment
      const newFollowUpAppointment = new appointmentModel({
        doctor_username: doctorUsername,
        patient_username: patientUsername,
        date,
        time,
        status: 'upcoming',
      });
  
      // Save the appointment
      await newFollowUpAppointment.save();
  
      // Optionally, update the doctor's available time slots, if needed
  
      return res.status(201).json({ message: 'Follow-up appointment scheduled successfully', appointment: newFollowUpAppointment });
    } catch (error) {
      console.error('Error scheduling follow-up appointment:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  });*/

  const scheduleFollowUpAppointment = asyncHandler(async (req, res) => {
    const appointment = req.body;

    if (
        appointment.doctor_username === undefined ||
        appointment.patient_username === undefined ||
        appointment.appointmentDateTime === undefined ||
        appointment.followUpDateTime === undefined
    ) {
        res.status(400).json({
            message: 'Please provide doctor username, patient username, and appointment date',
            createdAppointment: false
        });
        return;
    }

    const doctor = await doctorModel.findOne({ username: appointment.doctor_username });
    const patient = await patientModel.findOne({ username: appointment.patient_username });

    if (!patient) {
        res.status(400).json({ message: 'Patient not found', createdAppointment: false });
        return;
    }

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

    // Check for duplicate follow-up appointments
    const existingFollowUp = await followUpModel.findOne({
        doctor_username: appointment.doctor_username,
        patient_username: appointment.patient_username,
        appointmentDateTime: appointment.appointmentDateTime,
        followUpDateTime: appointment.followUpDateTime
    });

    if (existingFollowUp) {
        const errorMessage = 'Duplicate follow-up appointment found';
        console.log(errorMessage); // Log the error message
        res.status(400).json({ message: errorMessage, createdAppointment: false });
        return;
    }

    appointment.status = "pending";

    const newAppointment = await followUpModel.create(appointment);

    console.log('Available Time Slots Before:', doctor.availableTimeSlots);

    const appointmentTimeAsString = new Date(appointment.appointmentDateTime).toISOString();

    const remainingTimeSlots = doctor.availableTimeSlots.filter(slot => {
        const slotAsString = new Date(slot).toISOString();
        return slotAsString !== appointmentTimeAsString;
    });

    console.log('Available Time Slots After:', remainingTimeSlots);

    doctor.availableTimeSlots = remainingTimeSlots;
    await doctor.save();

    res.status(200).json({ message: 'Success', appointment: newAppointment, createdAppointment: true });
});

const getScheduledFollowUp = asyncHandler(async(req,res)=>{
    const doctor = req.body.username
    const followUps = await followUpModel.find({doctor_username:doctor})
    //console.log(followUps)
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
            return slot.getTime() !== chosenTimeSlot.getTime() ;
        });
        await doctor.save();
    }

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

    // Cancelled before 24 hours , so refund
    existingAppointment.status = 'canceled';
        
    const refund = existingAppointment.price;
        
     // Update patient's wallet balance (assuming you have a Patient model with a walletBalance field)
    try {
        const patient = await patientModel.findOne({username: existingAppointment.booked_by});
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

    res.status(200).json({ message: 'Success', canceledAppointment: true, refundAmount: refund });
});
  
module.exports = {getUpcomingAppointments , getPastAppointments, scheduleFollowUpAppointment, getScheduledFollowUp, rescheduleAppointment, cancelAppointment};