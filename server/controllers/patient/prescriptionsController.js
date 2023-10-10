// #Task route solution
const userModel = require('../../models/Prescription');
const { default: mongoose } = require('mongoose');
const asyncHandler = require('express-async-handler');

const createPrescription = asyncHandler( async (req, res) => {
    const prescription = req.body;
    const newPrescription = await userModel.create(prescription);
    res.status(200).json({ message: 'Success', prescription: newPrescription});
});
const getMedicines = async (req, res) => {
  const medicines = await userModel.find({}).sort({ createdAt: -1 }).select('patient_username doctor_username visit_date filled');
  console.log('Fetched users:', medicines); // Add this line for debugging
  res.status(200).json(medicines)
}
// const viewMyPrescriptions = async (req, res) => {
//     try {
//       const users = await userModel.find({}).sort({created:-1});
//       console.log('Fetched users:', users); // Add this line for debugging
//       res.status(200).json({users });
//     } catch (error) {
//       console.error('Error fetching users:', error); // Add this line for debugging
//       res.status(500).json({ error: 'Failed to fetch users' });
//     }
//   };
  const getPrescription = async (req,res) => {
    //const appointments = await appointmentModel.find({ doctor_username: req.query.doctor_username });
    const prescription = await userModel.findOne({ username: req.query.patient_username });
    if(!prescription){
      return res.status(404).json({error:'No such prescription'});
    }
    res.status(200).json(prescription);
  }
const getPatients = asyncHandler( async (req, res) => {
    // Check if the doctor username is provided
    if (req.query.doctor_username === undefined) {
        return res.status(400).json({ message: 'Please add a doctor username!' });
    }

    const doctor = await doctorModel.findOne({ username: req.query.doctor_username });
    if (!doctor) {
        return res.status(404).json({ message: 'Doctor not found!' });
    }

    // Get all appointments with the doctor specified in the request
    const appointments = await appointmentModel.find({ doctor_username: req.query.doctor_username });

    // Get all patients of the doctor
    const patients = await patientModel.find({ username: { $in: appointments.map(appointment => appointment.patient_username) } });

    // Add appointments to the patient
    let modifiedPatients = [...patients];
    for (let i = 0; i < modifiedPatients.length; i++) {
        let filteredAppointments = appointments.filter(appointment => appointment.patient_username === modifiedPatients[i].username);
        modifiedPatients[i]._doc.appointments= filteredAppointments;
    }

    res.status(200).json({ message: 'Success', patients: modifiedPatients });
});

    

  const filterPrescriptionByDoctor = async (req, res) => {
    
        const doctorName = req.params.name; // The doctor's name entered by the user

        // Use a case-insensitive regular expression for the doctor's name
        const allDoctors = await userModel.find().select('patient_username doctor_usernaame visit_date filled')
    // List of filtered Doctors
    let filteredDoctors = [];

    for ( let i = 0 ; i < allDoctors.length ; i++ ) {
      if (allDoctors[i].doctor_username == doctorName) {
          filteredDoctors.push(allDoctors[i])
      }
  }

    
    if (filteredDoctors.length == 0) {
        return res.status(404).json({ error: 'doctor not found' })
    }

    res.status(200).json(filteredDoctors)

};
const filterPrescriptionByfilled = async (req, res) => {
  try {
      const filledName = req.params.filledName; // The filled status entered by the user (true or false)

      // Assuming you have a Prescription model in MongoDB
      const allPrescriptions = await userModel.find({
          filled: filledName === 'true', // Convert the user's input to a boolean
      });

      if (!allPrescriptions || allPrescriptions.length === 0) {
          return res.status(404).json({ error: 'Prescriptions not found' });
      }

      res.status(200).json(allPrescriptions);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};



   
  const filterPrescriptionByDate = async (req, res) => {
    const date= req.body.visitDate;

    // Check if the chosen date and time has already passed
    const currentDate = new Date().toLocaleDateString('en-GB');

    if (date < currentDate) {
        return res.status(400).json({ message: 'Chosen date passed' });
    }

    // Query for prescriptions with matching visit_date
    try {
      const allDates= await userModel.find({date}).select('patient_username doctor_usernaame visit_date filled')

      let filteredvisitdates = [];

      for ( let i = 0 ; i < allDates.length ; i++ ) {
          if (allDates[i].name == date) {
            filteredvisitdates.push(allDates[i])
          }
      }
      
      if (!filteredvisitdates || filteredvisitdates.length == 0) {
          return res.status(404).json({ error: 'date not found' })
      }
  
      res.status(200).json(filteredvisitdates)
  
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
const selectPrescriptionFromMyList = async (req, res) => {
  const prescriptionSelect = req.params.prescriptionSelect; // Convert to lowercase for case-insensitive search

  try {
    // Assuming you have a collection of prescriptions and it's named `Prescription`
    const selectedPrescription = await userModel.findOne({
      patient_username: { $regex: `.*\\b${prescriptionSelect}\\b.*`, $options: 'i' },
    }).select('patient_username doctor_username visit_date filled');
    
    if (!selectedPrescription) {
      return res.status(404).json({ error: 'Prescription not found' });
    }

    res.status(200).json(selectedPrescription);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


 
  




module.exports = {getMedicines,createPrescription,getPrescription,filterPrescriptionByDate,filterPrescriptionByDoctor,filterPrescriptionByfilled,selectPrescriptionFromMyList};
