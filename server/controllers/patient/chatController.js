const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');
const messageModel = require('../../models/Message.js');
const doctorModel = require('../../models/Doctor.js');
const appointmentModel = require('../../models/Appointment.js');

const getMessages = asyncHandler(async (req, res) => {
    const patient_username = req.body.username;
    const doctor_username = req.params.user_username;

    const patient_messages = await messageModel.find({ sender_username: patient_username, receiver_username: doctor_username });
    const doctor_messages = await messageModel.find({ sender_username: doctor_username, receiver_username: patient_username });

    let messages = [];
    
    if (patient_messages && doctor_messages) {
        messages = patient_messages.concat(doctor_messages);
    }
    else if (patient_messages) {
        messages = patient_messages;
    }
    else if (doctor_messages) {
        messages = doctor_messages;
    }

    messages.sort((a, b) => a.timestamp - b.timestamp); // sort messages in ascending order

    return res.status(200).json({ messages: messages });

});

const postMessage = asyncHandler(async (req, res) => {
    const patient_username = req.body.username;
    const doctor_username = req.params.user_username;
    const message = req.body.message;
    console.log(req.body);

    await messageModel.create({
        sender_username: patient_username,
        receiver_username: doctor_username,
        message: message,
    })

    return res.status(200).json({ message: 'Message is sent successfully' });
});

const getUsers = asyncHandler(async (req, res) => {
    const username = req.body.username;

    let doctorResults = await appointmentModel.find({patient_username: username}).select("doctor_username");
    doctorResults = doctorResults.map((doctor) => doctor.doctor_username);
    doctorResults = new Set(doctorResults);    
    doctorResults = [...doctorResults];
    console.log(doctorResults);

    return res.status(200).json({ users: doctorResults });
});

module.exports = { getMessages, postMessage, getUsers };