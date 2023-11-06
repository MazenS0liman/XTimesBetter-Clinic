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
const acceptDoctor = asyncHandler(async(req, res)=>{
    const doctorId = req.params.id;
    try {
        // Assuming you have a Mongoose model named "Doctor" representing doctors
        const doctor = await doctorREQsModel.findByIdAndUpdate(doctorId, { status: 'accepted' }, { new: true });

        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }

        return res.status(200).json({ message: 'Doctor accepted successfully', doctor });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'An error occurred while accepting the doctor' });
    }
})

const rejectDoctor = asyncHandler(async(req, res)=>{
        const doctorId = req.params.id;
            try {
                // Assuming you have a Mongoose model named "Doctor" representing doctors
                const doctor = await doctorREQsModel.findByIdAndUpdate(doctorId, { status: 'rejected' }, { new: true });
        
                if (!doctor) {
                    return res.status(404).json({ message: 'Doctor not found' });
                }
        
                return res.status(200).json({ message: 'Doctor rejected successfully', doctor });
            } catch (error) {
                console.error('Error:', error);
                res.status(500).json({ message: 'An error occurred while accepting the doctor' });
            }
       
    
    });

module.exports ={viewReqDoctorsInfo,acceptDoctor,rejectDoctor};