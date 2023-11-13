const mongoose = require('mongoose');

const contractSchema = mongoose.Schema({
    doctorName: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    employmentDate: {
        type: String,
        required: true,
    },
    terminationDate: {
        type: String,
    },
    doctorFees: {
        type: Number,
        required: true,
    },
    markupRate: {
        type: Number,
        required: true,
    },
    accepted: {
        type: Boolean,
        default: false,
    },
    status: {
        type: String,
        required: true,
    },

});

const Contract = mongoose.model('Contract', contractSchema);

module.exports = Contract;