const Doctor = require('../../models/Doctor')
const Appointment = require('../../models/Appointment')
const Patient = require('../../models/Patient')
const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose')

// Get all Doctors
const getDoctors = async (req, res) => {
    const doctors = await Doctor.find({}).sort({createdAt : -1})

    res.status(200).json(doctors)    
}

const getDoctorsWithPackages = asyncHandler( async (req, res) => {
    // Check if the patient username is provided
    if (req.body.username === undefined) {
        return res.status(400).json({ message: 'Please add a patient username!' });
    }
    //Check if patient name valid
    const patient = await patientModel.findOne({ username: req.body.username });
    if (!patient) {
        return res.status(404).json({ message: 'Patient not found!' });
    }

    //Check if patient subscribed in any package 
    const packages = await packageModel.find({ subscribed_patients: patient.username });
    console.log(packages);

    //Retrieve all Drs
    const doctors = await Doctor.find();
    var doctorsresult=[];

    
    if (packages.length>0){

     console.log(packages[0].doctor_discount);
     doctorsresult = doctors.map((doctor) => ({
      ...doctor.toObject(),
      hourly_rate:
        (doctor.hourly_rate + (doctor.hourly_rate * 0.1 ))-( (packages[0].doctor_discount/100.0) * doctor.hourly_rate),
     }));

      res.status(200).json({ message: 'Success', doctorsresult});


    }
    else {

      doctorsresult= doctors.map((doctor) => ({...doctor.toObject(),
            hourly_rate: (doctor.hourly_rate + doctor.hourly_rate*0.1)
     }));
    
      res.status(200).json({ message: 'Success', doctorsresult});

    }

     
    });



// Get doctor based on given doctor name using "search"
const searchDoctorByName = async (req, res) => {
    const name = req.params.name

    // RegExp with 'i' , to make "name" case-insensitive & it has the property to check if the string is "included" (not a must to be exactly equal to doctor name) 
    const doctorName = new RegExp(`^${name}`, 'i')

    const doctorsSearchResult = await Doctor.find({name: doctorName})
    
    if (!doctorsSearchResult || doctorsSearchResult.length == 0) {
        return res.status(404).json({ error: 'doctor not found' })
    }

    res.status(200).json(doctorsSearchResult)
}

// Get doctor based on given doctor speciality using "search"
const searchDoctorBySpeciality = async (req, res) => {
    const speciality = req.params.speciality

    // RegExp with 'i' , to make "name" case-insensitive & it has the property to check if the string is "included" (not a must to be exactly equal to doctor name) 
    const doctorSpeciality = new RegExp(`^${speciality}`, 'i')
    const doctorsSearchResult = await Doctor.find({speciality: doctorSpeciality})
    
    if (!doctorsSearchResult || doctorsSearchResult.length == 0) {
        return res.status(404).json({ error: 'doctor not found' })
    }

    res.status(200).json(doctorsSearchResult)
}

const searchDoctorByNameandSpeciality = async (req, res) => {
    const name = req.params.name
    const speciality = req.params.speciality

    // RegExp with 'i' , to make "name" case-insensitive & it has the property to check if the string is "included" (not a must to be exactly equal to doctor name) 
    const doctorName = new RegExp(`^${name}`, 'i')
    const doctorSpeciality = new RegExp(`^${speciality}`, 'i')

    const doctorsSearchResult = await Doctor.find({name: doctorName, speciality: doctorSpeciality})
    
    if (!doctorsSearchResult || doctorsSearchResult.length == 0) {
        return res.status(404).json({ error: 'doctor not found' })
    }

    res.status(200).json(doctorsSearchResult)
}

const getAppointments = async (req, res) => {
    const app = await Appointment.find({}).sort({createdAt : -1})
    res.status(200).json(app)
}

// Filtering doctors by speciality given.
const filterDoctorBySpeciality = async (req, res) => {
    // The speciality chosen to filter based on.
    const specialityFilter = req.params.speciality

    const allDoctors = await Doctor.find({}).select('name speciality hourly_rate')

    // List of filtered Doctors
    let filteredDoctors = []

    for ( let i = 0 ; i < allDoctors.length ; i++ ) {
        if (allDoctors[i].speciality.toLowerCase() == specialityFilter.toLowerCase()) {
            filteredDoctors.push(allDoctors[i])
        }
    }
    
    if (!filteredDoctors || filteredDoctors.length == 0) {
        return res.status(404).json({ error: 'doctor not found' })
    }

    res.status(200).json(filteredDoctors)
}

// Filter doctor availability by date and time.
const filterDoctorByTime = async (req, res) => {
    const datetime = req.body.datetime
    console.log(datetime)

    //const filteredDate = new Date(datetime);
    //console.log(filteredDate)

    const currentDate = new Date().toLocaleDateString('en-GB');

    // Check if the availability date chosen has already passed
    if (datetime < currentDate) {
        res.status(400).json({ message: 'Chosen date has already passed'});
    }

    // Getting all appointments
    const appointmentsMade = await Appointment.find({time : datetime})
    console.log(appointmentsMade)

    // if no appointments found on that date & time , then  returns the doctor that is available.
    if (!appointmentsMade || appointmentsMade.length == 0 ) {
        res.status(200).json(await Doctor.find({}).select('name speciality hourly_rate'))
    } 
    else {
        res.status(400).json({ message: 'No available slots on that day / time'});
    }
}


// Filter by doctor name and time
const filterDoctorBySpecialityandTime = async (req,res) => {
    const specialityFilter = req.body.speciality
    const allDoctors = await Doctor.find({})

    // List of filtered Doctors
    let filteredDoctors = []

    for ( let i = 0 ; i < allDoctors.length ; i++ ) {
        if (allDoctors[i].speciality.toLowerCase() == specialityFilter.toLowerCase()) {
            filteredDoctors.push(allDoctors[i])
        }
    }

    // Filtering By Date :
    const datetime = new Date(req.body.datetime)
    // console.log(datetime)
    
    const currentDate = new Date().toLocaleDateString('en-GB');

    // Check if the availability date chosen has already passed
    if (datetime < currentDate) {
        res.status(400).json({ message: 'Chosen date has already passed'});
    }
    /*
    for (let i = 0 ; i < filteredDoctors.length ; i++ ) {
        if (filteredDoctors[i].availableTimeSlots === datetime)
    }
    */

    // Gets all doctors with the given filtering speciality that has this time slot 
    intermediateResult = []  
    console.log(filteredDoctors)  
    for ( let doctor of filteredDoctors) {
        //console.log(doctor)
        for (let i = 0 ; i < doctor.availableTimeSlots.length ; i++) {
            if (doctor.availableTimeSlots[i].getTime() === datetime.getTime()){
                intermediateResult.push(doctor)
            }
        }
        /*
        console.log(doctor.availableTimeSlots)
        console.log("Datetime" , datetime)
        */
    }
    console.log( intermediateResult)
    // Checks over the doctors from intermediate if they have an appointment in this time slot or not. If no appointment found , then the time slot is available.
    const result = []
    for (let doctor of intermediateResult) {
        const appointmentsMade = await Appointment.find({
            $and: [
              { doctor_username : doctor.username  },
              { time : datetime },
            ]
          })
        
        if (!appointmentsMade || appointmentsMade.length == 0 ) {
           result.push(doctor)
        } 
    }
    console.log("Result: ", result)

    if (!result || result.length == 0) {
        return res.status(404).json({ error: 'No available doctor of this speciality in this slot' })
    }

    res.status(200).json(result)
}


// Getting selected doctor details.
const selectedDoctorDetails = async (req,res) => {
    const selectedDoctor = req.params.selectedDoctor

    // IgnoreCase 
    const doctorName = new RegExp(selectedDoctor, 'i')

    const doctorDetails = await Doctor.findOne({name : doctorName}).select('name speciality affilitation educational_background hourly_rate')
    
    if (!doctorDetails || doctorDetails.length == 0) {
        return res.status(404).json({ error: 'doctor not found' })
    }

    res.status(200).json(doctorDetails)
}

// Get Doctor Available Appointments
const selectedDoctorAppointments = async(req,res) => {
    const doctor = await Doctor.findOne({
        username: req.query.doctor_username,
    }).select('name availableTimeSlots');

    
    if (!doctor) {
        return res.status(404).json('No');
    }
    res.status(200).json(doctor.availableTimeSlots); 
}



module.exports = {
    getDoctors,
    searchDoctorByName,
    searchDoctorBySpeciality,
    searchDoctorByNameandSpeciality,
    filterDoctorBySpeciality,
    filterDoctorByTime,
    filterDoctorBySpecialityandTime,
    selectedDoctorDetails,
    selectedDoctorAppointments,
    getAppointments,
    getDoctorsWithPackages,
}
