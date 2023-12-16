const { default: mongoose } = require('mongoose');
const appointmentModel = require('../../models/Appointment');

 const AllApointnments = async (req, res) => {

    const patient_username=req.body.username;
    const appointments = await appointmentModel.find({patient_username : patient_username ,  status: { $in: ['upcoming', 'reschedule']}});     
    res.status(200).json(appointments);
           
 }

 const StartAppointment = async (req, res) => {

    const appointment_id=req.body.appointment_id;
    const appointment = await appointmentModel.findById(appointment_id);   
    
    if (appointment) {
        // Get the start time of the appointment
        const appointmentStartTime = appointment.time;
  
        // Calculate the end time of the appointment (start time + 1 hour)
        const appointmentEndTime = new Date(appointmentStartTime);
        appointmentEndTime.setHours(appointmentEndTime.getHours() + 1);
  
        // Get the current date and time
        const now = new Date();
        console.log(now);
        now.setHours(now.getHours()+2);
        console.log(now);
  
        // Check if the current date and time are within the appointment's time range
        if (now >= appointmentStartTime && now <= appointmentEndTime) {
            const updatedAppointment = await appointmentModel.findByIdAndUpdate(appointment_id,{status:"completed"});   
            res.status(200).json(updatedAppointment);

        } else if (now<appointmentStartTime){
            res.status(408).json({ message: 'This appointment time hasnot reached yet' });
        }
        else if (now >appointmentEndTime){
            res.status(409).json({ message: 'This appointment time has passed' });
        }
      } 
    
    
           
 }






module.exports = {AllApointnments,StartAppointment};