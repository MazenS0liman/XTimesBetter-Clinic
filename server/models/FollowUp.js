const mongoose = require('mongoose');
const FollowUpSchema = mongoose.Schema({
    doctor_username: {
        type: String,
        required: true
    },
    patient_username: {
        type: String,
        required: true
    },
    appointmentDateTime: {
        type: Date,
        required: true
    },
    followUpDateTime: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['accepted', 'pending', 'rejected'],
        required: true,
    },
    appointment_ID: {
        type: String,
        required: true
    }
}, { timestamps: true });


const FollowUp = mongoose.model('FollowUp', FollowUpSchema);
module.exports = FollowUp;