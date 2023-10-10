const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');
const doctorREQsModel = require('../../models/DoctorRequests');

const viewReqDoctorInfo = asyncHandler(async(req, res)=>{
    console.log(req.query)
    const { username }=req.query;

    const query={username}
    const requestedDoctor= await doctorREQsModel.find(query);
    console.log(requestedDoctor);
    if(requestedDoctor){
        res.status(200).json(requestedDoctor); 
    } else{
        res.status(400).json({ message: 'Requested Doctor not found!'});
    }

})

module.exports ={viewReqDoctorInfo};