const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');
const patientModel = require('../../models/Patient.js');
const appointmentModel = require('../../models/Appointment.js');
const messageModel = require('../../models/Message.js');
const pharmacistModel = require('../../models/Pharmacist.js');

const getMessages = asyncHandler(async (req, res) => {
    const username1 = req.body.username; // logged in user
    const username2 = req.params.user_username;
    console.log("Get Params");
    console.log(req.params);
    console.log("Get Body");
    console.log(req.body);

    const messages1 = await messageModel.find({ sender_username: username2, receiver_username: username1 });
    const messages2 = await messageModel.find({ sender_username: username1, receiver_username: username2 });

    let messages = [];
    
    if (messages1 && messages2) {
        messages = messages1.concat(messages2);
    }
    else if (messages1) {
        messages = messages1;
    }
    else if (messages2) {
        messages = messages2;
    }

    messages.sort((a, b) => a.timestamp - b.timestamp); // sort messages in ascending order

    return res.status(200).json({ messages: messages });
});

const postMessage = asyncHandler(async (req, res) => {
    const username1 = req.body.username;
    const username2 = req.params.user_username;
    const message = req.body.message;
    console.log("Post Params");
    console.log(req.params);
    console.log("Post Body");
    console.log(req.body);

    await messageModel.create({
        sender_username: username1,
        receiver_username: username2,
        message: message,
    })

    return res.status(200).json({ message: 'Message is sent successfully' });
});

const getUsers = asyncHandler(async (req, res) => {
    const username = req.body.username;

    let patientResults = await appointmentModel.find({doctor_username: username}).select("patient_username");
    let pharmacistResults = await pharmacistModel.find({}).select("username name");
    let patients = await patientModel.find({}).select("username name");

    patientResults = patientResults.map((patient) => patient.patient_username);
    patientResults = patients.filter((patient) => patientResults.includes(patient.username));    
    patientResults = patientResults.map((patient) => {return {username: patient.username, name: patient.name, type: "patient"}});
    patientResults = patientResults.filter((arr, index, self) => index === self.findIndex((t) => (t.username === arr.username && t.name === arr.name && t.type === arr.type)));
    patientResults = new Set(patientResults);    
    patientResults = [...patientResults];

    pharmacistResults = pharmacistResults.map((pharmacist) => {return {username: pharmacist.username, name: pharmacist.name, type: "pharmacist"}});
    pharmacistResults = pharmacistResults.filter((arr, index, self) => index === self.findIndex((t) => (t.username === arr.username && t.name === arr.name && t.type === arr.type)));
    console.log(pharmacistResults);
    pharmacistResults = new Set(pharmacistResults);
    pharmacistResults = [...pharmacistResults];

    let result = patientResults.concat(pharmacistResults);

    console.log("Get Results:");
    console.log(result);

    return res.status(200).json({ users: result });
});

module.exports = { getMessages, postMessage, getUsers };