const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');
const doctorModel = require('../../models/Doctor');

const viewDoctorInfo = asyncHandler(async(req, res)=>{
    
    const { username }=req.body;
    const query={username}
    const doctor= await doctorModel.find(query);
    console.log(doctor);
    if(doctor){
        res.status(200).json(doctor); 
    } else{
        res.status(400).json({ message: 'Doctor not found!'});
    }

})



const updateDoctorInfo = asyncHandler(async(req, res)=>{
    try{
        const { username, email, hourly_rate, affiliation } = req.body;
        const query={username}
        const doctor = await doctorModel.findOne({ username });
        const updatedFields = {};

        if(!doctor){
            return res.status(404).json({ error: 'Doctor not found' });
        }
        if (req.body.email !=='') {
            updatedFields.email = req.body.email;
        }
        if (!isNaN(req.body.hourly_rate) && req.body.hourly_rate !== 0 ) {
            updatedFields.hourly_rate = parseInt(req.body.hourly_rate);
        }
        if (req.body.affiliation !=='') {
            updatedFields.affiliation = req.body.affiliation ;
        }
        
        const updatedDoctor = await doctorModel.findOneAndUpdate(query, updatedFields, { new: true });

       
        console.log('Doctor updated successfully:', updatedDoctor);
        res.status(200).json(updatedDoctor); 
    } catch (error) {
      console.error('Update error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }   
});


module.exports ={viewDoctorInfo,updateDoctorInfo};