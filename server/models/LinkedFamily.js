const mongoose = require('mongoose');

const LinkedFamilySchema = mongoose.Schema({
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
    gender: {
        type: String,
        enum: ['male', 'female'],
        required: true,
    },
    mobile: {
        type: String,
        required: true,
    },
    emergency_contact: {
        type: mongoose.Schema.Types.Mixed,
        required: true,
    },
    subscribed_package: {
        type: String,
        required: false,
    },
    medicalHistory: {
        data: Buffer,
        contentType: String,
        //required: false,
    },
    relation: {
        type: String,
        enum: ['wife', 'husband', 'children'],
        required: true,
    },
    patient_username: {
        type: String,
        required: true,
    },

}, { timestamps: true });


const LinkedFamily = mongoose.model('LinkedFamily', LinkedFamilySchema);
module.exports = LinkedFamily;