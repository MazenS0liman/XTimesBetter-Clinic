const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');
const patientModel = require('../../models/Patient');
const doctorModel = require('../../models/Doctor');
const appointmentModel = require('../../models/Appointment');
const subsPackageModel = require('../../models/SubscribedPackages');
const packageModel = require('../../models/Package');

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
    
    res.status(200).json({ message: 'Success', appointment: newAppointment, createdAppointment: true, rowAppointmentID : newAppointment._id  });
});


// Get Upcoming appointments
const getUpcomingAppointments = asyncHandler( async (req, res) => 
{
    const patient = await patientModel.findOne({
        username: req.body.username,
    });
    if (!patient) {
        return res.status(404).json('No');
    }
    const upcomingAppointments = await appointmentModel.find({patient_username: patient.username , status:"upcoming"});
    res.status(200).json(upcomingAppointments);
});

// Get Completed (Past) Appointments 
const getPastAppointments = asyncHandler( async (req, res) => 
{
    const patient = await patientModel.findOne({
        username: req.body.username,
    });
    if (!patient) {
        return res.status(404).json('No');
    }
    const upcomingAppointments = await appointmentModel.find({patient_username: patient.username , status:"completed"});
    res.status(200).json(upcomingAppointments);
});


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

    if (isSubs.length > 0) { // Check the length of the array
        const package_name = isSubs[0].package_name;
        //console.log("Package Name" ,package_name)
        const package = await packageModel.findOne({ name: package_name });
        //console.log("Package" ,package)

        const doctor_hourlyRate = await doctorModel.findOne({ username: doctorUsername }).select('hourly_rate');
        //console.log(doctor_hourlyRate.hourly_rate)
        //console.log(package.doctor_discount)

        patient_hourlyRate = (doctor_hourlyRate.hourly_rate + (doctor_hourlyRate.hourly_rate * 0.1 ))-( (package.doctor_discount/100.0) * doctor_hourlyRate.hourly_rate)
    } else {
        const doctor_hourlyRate = await doctorModel.findOne({ username: doctorUsername }).select('hourly_rate');
        patient_hourlyRate = doctor_hourlyRate.hourly_rate + doctor_hourlyRate.hourly_rate*0.1
    }

    console.log("Hourly", patient_hourlyRate);
    //console.log(res.status(200).json(patient_hourlyRate))
    res.status(200).json(patient_hourlyRate);
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
    
    //console.log(isSubs)
    //console.log(isSubs.length)
    // All doctors
    let patient_hourlyRate = 0; // Initialize with a default value

    if (isSubs.length > 0) { // Check the length of the array
        const package_name = isSubs[0].package_name;
        //console.log("Package Name" ,package_name)
        const package = await packageModel.findOne({ name: package_name });
        //console.log("Package" ,package)

        const doctor_hourlyRate = await doctorModel.findOne({ username: doctorUsername }).select('hourly_rate');
        //console.log(doctor_hourlyRate.hourly_rate)
        //console.log(package.doctor_discount)

        patient_hourlyRate = (doctor_hourlyRate.hourly_rate + (doctor_hourlyRate.hourly_rate * 0.1 ))-( (package.doctor_discount/100.0) * doctor_hourlyRate.hourly_rate)
    } else {
        const doctor_hourlyRate = await doctorModel.findOne({ username: doctorUsername }).select('hourly_rate');
        patient_hourlyRate = doctor_hourlyRate.hourly_rate + doctor_hourlyRate.hourly_rate*0.1
    }

    //console.log("Hourly", patient_hourlyRate);
    //console.log(res.status(200).json(patient_hourlyRate))
    res.status(200).json(patient_hourlyRate);
}

// Get all appointments booked by me
const getBookedAppointments = asyncHandler( async (req,res)=> {
    const currentUser = req.body.username;
    //console.log(currentUser)
    const bookedAppointments = await appointmentModel.find({booked_by: currentUser})
    //console.log(bookedAppointments)
    res.status(200).json(bookedAppointments);
})

// Get all appointments
const getAppointments = asyncHandler( async (req, res) => {
    const appointments = await appointmentModel.find({});
    res.status(200).json(appointments);
});


module.exports = {createAppointment, getAppointments, getUpcomingAppointments, getPastAppointments,getBookedAppointments, getHourlyRateByUsername, getHourlyRateByNationalID};