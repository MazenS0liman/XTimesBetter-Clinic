const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');
//const adminModel = require('../../models/Admin');
//const patientModel = require('../../models/Patient');
const doctorModel = require('../../models/Doctor');
const contractModel = require('../../models/Contract');
const bcrypt = require('bcrypt');
const addTimeSlot = asyncHandler(async (req, res) => {
  const myUsername = req.body.username;
  const contract = await contractModel.findOne({ username: myUsername });
  const doctor = await doctorModel.findOne({ username: myUsername });
//console.log(contract);
if (!doctor) 
  return res.status(400).json({ message: 'Doctor not found, cannot add time slots', registeredIn: false });
else if (!contract || !contract.accepted) {
  return res.status(400).json({ message: 'Contract not accepted, cannot add time slots', registeredIn: false });
} else if (!doctor) {
  return res.status(400).json({ message: 'Doctor not found, cannot add time slots', registeredIn: false });
} else {
  const newTimeSlots = req.body.availableTimeSlots; // Array of dates
  const allTimeSlots= await doctorModel.distinct('availabeTimeSlots', {username: myUsername});
  const found=allTimeSlots.includes(newTimeSlots);
  console.log(found);
  if(!found){
  const updatedDoctor = await doctorModel.findOneAndUpdate(
    { username: myUsername, 'availableTimeSlots': { $ne: newTimeSlots[0] } },
    { $push: { availableTimeSlots: newTimeSlots[0] } },
    { new: true }
  );
  res.status(200).json({ message: 'Time slots added successfully', registeredIn: true, updatedDoctor });
  }
  else{
    return res.status(400).json({ message: 'Time slot already exists', registeredIn: false });
  }


    //res.status(200).json({ message: 'Time slots added successfully', registeredIn: true, updatedDoctor });
  }
});
  

module.exports= {addTimeSlot};
