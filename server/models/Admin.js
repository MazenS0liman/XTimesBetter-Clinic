const mongoose = require('mongoose');

const AdminstratorSchema = mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    firstName: {
        type: String,
        required: false,
    }, 
    lastName: {
        type: String,
        required: false,
    },
    email: {
        type: String,
        required: false,
    },
}, { timestamps: true });


const Admin = mongoose.model('Admin', AdminstratorSchema);
module.exports = Admin;