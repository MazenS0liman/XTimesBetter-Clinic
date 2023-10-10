const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');
const doctorModel = require('../../models/Doctor');

const removeDoctor = asyncHandler(async(req, res)=>{
    
    const { username } = req.body;
    const query={username}
    const doctor= await doctorModel.findOne(query);
    if(!doctor){
        return res.status(400).json({ message: 'Doctor not found!'});
    }
    const removed= await doctorModel.findOneAndDelete(query);
    
    if(removed.ok){
        res.status(200).json({message:'Doctor is removed successfully'}); 
    } else{
        res.status(400).json({ message: 'Doctor can not be removed found!'});
    }
    
})

module.exports ={removeDoctor};