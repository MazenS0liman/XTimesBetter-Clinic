const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');
const doctorREQsModel = require('../../models/DoctorRequests');
const doctorModel = require('../../models/Doctor');
const contractModel= require('../../models/Contract');
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
    const start_date= new Date();
    const startDateStr=start_date.toISOString().split('T')[0];

    const terminationDate=start_date;
    terminationDate.setFullYear(terminationDate.getFullYear()+1);
    const terminationDateStr=terminationDate.toISOString().split('T')[0];
    try {
        // Assuming you have a Mongoose model named "Doctor" representing doctors
        const doctor = await doctorREQsModel.findByIdAndUpdate(doctorId, { status: 'accepted' }, { new: true });

        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }
        const newDoctor= await doctorModel.create({
            username:doctor.username,
            name:doctor.name,
            email:doctor.email,
            password:doctor.password,
            dob:doctor.dob,
            hourly_rate:doctor.hourly_rate,
            educational_background:doctor.educational_background,
            affiliation:doctor.affiliation,
            speciality:doctor.speciality,
            availableTimeSlots:doctor.availableTimeSlots,
            nationalID:doctor.nationalID,
            medicalLicense:doctor.medicalLicense,
            medicalDegree:doctor.medicalDegree,
            walletAmount:0

        })
        const newContract= await contractModel.create({
            doctorName:doctor.name,
            username:doctor.username,
            employmentDate:startDateStr,
            terminationDate:terminationDateStr,
            doctorFees:doctor.hourly_rate,
            markupRate:10,
            accepted:false,
            status:"Pending"
    
        })
        return res.status(200).json({ message: 'Doctor request is accepted successfully', doctor });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'An error occurred while accepting the request of the doctor' });
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
                return res.status(200).json({ message: 'Doctor request is rejected successfully', doctor });
            } catch (error) {
                console.error('Error:', error);
                res.status(500).json({ message: 'An error occurred while accepting the request of the doctor' });
            }
       
    
    });

module.exports ={viewReqDoctorsInfo,acceptDoctor,rejectDoctor};
