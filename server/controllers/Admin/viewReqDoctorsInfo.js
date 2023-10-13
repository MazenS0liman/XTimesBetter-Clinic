const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');
const doctorREQsModel = require('../../models/DoctorRequests');

const viewReqDoctorsInfo = asyncHandler(async(req, res)=>{
    
    const requestedDoctors = await doctorREQsModel.find();
    console.log(requestedDoctors);
    if(requestedDoctors){
        res.status(200).json(requestedDoctors); 
    } else{
        res.status(400).json({ message: 'Requested Doctors not found!'});
    }

})


module.exports ={viewReqDoctorsInfo};