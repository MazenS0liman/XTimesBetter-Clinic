const asyncHandler = require('express-async-handler');
const patients = require('../../../models/Patient');
const doctors= require('../../../models/Doctor');
const appointment= require('../../../models/Appointment');
const {  ObjectId } = require('mongodb');

const payAppointment = asyncHandler(async (req, res) => {
    

    const registeredPatient = await patients.findOne({ username: req.body.username });
    const doctorToPay = await doctors.findOne({username: req.body.doctorName});
    
    const totalAmount = req.body.appointmentPrice;
    console.log(totalAmount);

    if (registeredPatient) {
        console.log(registeredPatient);
        
        
        const patientWallet = registeredPatient.walletAmount;
        console.log(totalAmount <= patientWallet)
        if (totalAmount > patientWallet) {
            return res.status(400).json({ message: ' No Sufficient Funds in the wallet! ', success: false })
        }
        if (totalAmount <= patientWallet) {
            const newWalletAmout = patientWallet - totalAmount;
            const updatedPatient = await patients.findOneAndUpdate({ username: req.body.username }, { walletAmount: newWalletAmout });
            const doctorAmount = doctorToPay.walletAmount+ 0.5*totalAmount;
            const updatedDoctorWallet = await doctors.findOneAndUpdate({ username: req.body.doctorName }, { walletAmount: doctorAmount });
            const removeAppointment = await appointment.deleteOne(new ObjectId(req.body.rowId));

            // console.log("patient amount,",newWalletAmout)
            // console.log("doctor amount,",doctorAmount)
            
            return res.status(201).json({message: ' Payment done' , success: true});
        }
    }
    else {
        return res.status(400).json({ message: ' Patient not found', success: false });
    }
})




module.exports = { payAppointment };
