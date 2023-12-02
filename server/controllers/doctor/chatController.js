const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');
const patientModel = require('../../models/Patient.js');
const appointmentModel = require('../../models/Appointment.js');
const messageModel = require('../../models/Message.js');

const getMessages = asyncHandler(async (req, res) => {
    const doctor_username = req.body.username;
    const patient_username = req.params.user_username;
    console.log("Get Params");
    console.log(req.params);
    console.log("Get Body");
    console.log(req.body);

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
    const doctor_username = req.body.username;
    const patient_username = req.params.user_username;
    const message = req.body.message;
    console.log("Post Params");
    console.log(req.params);
    console.log("Post Body");
    console.log(req.body);

    await messageModel.create({
        sender_username: doctor_username,
        receiver_username: patient_username,
        message: message,
    })

    return res.status(200).json({ message: 'Message is sent successfully' });
});

const getUsers = asyncHandler(async (req, res) => {
    const username = req.body.username;

    let patientResults = await appointmentModel.find({doctor_username: username}).select("patient_username");
    patientResults = patientResults.map((patient) => patient.patient_username);
    patientResults = new Set(patientResults);    
    patientResults = [...patientResults];
    console.log(patientResults);

    return res.status(200).json({ users: patientResults });
});

module.exports = { getMessages, postMessage, getUsers };