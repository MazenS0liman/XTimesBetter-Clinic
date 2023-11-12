const mongoose = require('mongoose');

const DoctorRequestsSchema = mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    dob: {
        type: String,
        required: true,
    },
    hourly_rate: {
        type: Number,
        required: true,
    },
    affiliation: {
        type: String,
        required: true,
    },
    educational_background: {
        type: String,
        required: true,
    },
    availableTimeSlots:{
        type: [Date],
        //required: false,
    },
    status: {
        type: String,
        enum: ['accepted', 'onhold', 'rejected'],
        required: true,
    },
    speciality: {
        type: String,
        required: true
    },
    nationalID: {
        name: String,
        path: String,
        contentType: String,
    },
    medicalLicense: {
        name: String,
        path: String,
        contentType: String,
    },
    medicalDegree: {
        name: String,
        path: String,
        contentType: String,
    },
}, { timestamps: true });


const DoctorRequests = mongoose.model('DoctorRequests', DoctorRequestsSchema);
module.exports = DoctorRequests;