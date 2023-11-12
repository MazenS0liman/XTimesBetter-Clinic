const asyncHandler = require('express-async-handler');
const patients = require('../../../models/Patient');
const doctors= require('../../../models/Doctor');
const appointment= require('../../../models/Appointment');
const { default: mongoose } = require('mongoose');

const payAppointment = asyncHandler(async (req, res) => {

    const registeredPatient = await patients.findOne({ username: req.body.username });
    const doctorToPay = await doctors.findOne({username: req.body.doctorUsername});
    
    const totalAmount = req.body.appointmentPrice;

    if (registeredPatient) {
       
        const patientWallet = registeredPatient.walletAmount;
        if (totalAmount > patientWallet) {
            
            
            const removeAppointment = await appointment.findOneAndDelete({_id: new mongoose.Types.ObjectId(req.body.rowId)});
            // console.log(req.body.appointmentSlot);
            const updatedDoctorSlots = await doctors.findOneAndUpdate({ username: req.body.doctorUsername }, {$push: { availableTimeSlots: req.body.appointmentSlot } },{ new: true } );
            // console.log(updatedDoctorSlots);

            return res.status(400).json({ message: ' No Sufficient Funds in the wallet! ', success: false })
        }
        if (totalAmount <= patientWallet) {
            const newWalletAmout = patientWallet - totalAmount;
            const updatedPatient = await patients.findOneAndUpdate({ username: req.body.username }, { walletAmount: newWalletAmout });
            const doctorAmount = doctorToPay.walletAmount+ 0.5*totalAmount;
            const updatedDoctorWallet = await doctors.findOneAndUpdate({ username: req.body.doctorUsername }, { walletAmount: doctorAmount });
            
            return res.status(201).json({message: ' Payment done' , success: true});
        }
    }
    else {
       
        return res.status(400).json({ message: ' Patient not found', success: false });
    }
})


module.exports = { payAppointment };
