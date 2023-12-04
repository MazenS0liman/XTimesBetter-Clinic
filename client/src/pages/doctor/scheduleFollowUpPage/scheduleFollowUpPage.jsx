import React, { useState, useEffect } from 'react';
import styles from './scheduleFollowUpPage.module.css'
// Axios
import axios from 'axios';

// React Router DOM
import { useNavigate } from 'react-router-dom';

const ScheduleFollowUp = () => {
    const [appointments, setAppointments] = useState([]);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [followUpDateTime, setFollowUpDateTime] = useState('');
    const [showFollowUpSection, setShowFollowUpSection] = useState(false);
    //const [username, setUsername] = useState(""); 

    const [showTable, setShowTable] = useState(false);
    const [scheduledFollowUps, setScheduled] = useState([]);
    const [showAppointments, setShowAppointments] = useState(false);

    // const currentUser = "iaitchison1";
    const navigate = useNavigate();
    //Authenticate part
    const accessToken = sessionStorage.getItem('accessToken');
    const [load, setLoad] = useState(true);
    const [username, setUsername] = useState('');
    
    
    useEffect(() => {
        if (username.length != 0) {
            setLoad(false);
        }
    }, [username]);
    async function checkAuthentication() {
        await axios({
            method: 'get',
            url: 'http://localhost:5000/authentication/checkAccessToken',
            headers: {
                "Content-Type": "application/json",
                'Authorization': accessToken,
                'User-type': 'doctor',
            },
        })
            .then((response) => {
                console.log(response);
                setUsername(response.data.username);
                //setLoad(false);
            })
            .catch((error) => {
                //setLoad(false);
                navigate('/login');

            });
    }

    const xTest = checkAuthentication();

    //Authenticate part

    const getPastAppointments = async () => {
        const response = await fetch(`http://localhost:5000/doctor/appointments/getPastAppointmentsFollowUp`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': accessToken,
            },
        });

        if (response.status === 200) {
            const data = await response.json();
            setAppointments(data);
        } else {
            throw new Error('Error filtering appointments by status');
        }
    };

    const createFollowUp = async (appointment, followUpDateTime, followUpDate) => {
        const followUpData = {
            appointment : appointment,
            followUpDateTime: followUpDateTime,
            followUpDate : followUpDate,
            appointment_ID: appointment._id, 
        };
    
        try {
            const response = await fetch('http://localhost:5000/doctor/appointments/scheduleFollowUp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(followUpData),
            });
    
            if (response.ok) {
                const result = await response.json();
                console.log('Follow-up created:', result);
                return { success: true };
            } else {
                const errorData = await response.json();
                console.error('Error:', errorData.message);
                console.log("error", errorData)
                if (errorData.message === 'Duplicate follow-up appointment found') {
                    return { success: false, message: 'You already sent a follow-up request with the same date and time' };
                } else if (errorData.message === "Appointment date and time are in the past") {
                    return { success: false, message: 'Follow-up date is in the past' };
                } else {
                    return { success: false, message: 'Unknown error' };
                }
            }
        } catch (error) {
            console.error('Network error:', error.message);
            return { success: false, message: 'Network error' };
        }
    };

    const fetchPatientDetails = async (patientUsername) => {
        try {
            const response = await fetch(`http://localhost:5000/patient/appointment/getPatientByUsername?patient_username=${patientUsername}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': accessToken,
                },
            });
    
            if (response.status === 200) {
                const data = await response.json();
                return data.name; // Assuming the name field is present in the response
            } else {
                console.error('Error fetching patient details');
                return ''; // Return an empty string in case of an error
            }
        } catch (error) {
            console.error('Error fetching patient details:', error.message);
            return ''; // Return an empty string in case of an error
        }
    };
    
    const fetchPatientDetailsForAppointments = async () => {
        try {
            const appointmentsWithPatientName = await Promise.all(
                appointments.map(async (appointment) => {
                    const patientName = await fetchPatientDetails(appointment.patient_username);
                    return {
                        ...appointment,
                        patientName,
                    };
                })
            );
    
            setAppointments(appointmentsWithPatientName);
            //console.log("apps with names", appointments);
        } catch (error) {
            console.error('Error fetching patient details for appointments:', error.message);
        }
    };
    


    /*
    // function to get past appointments
    const getScheduledFollowUp = async (currentUser) => {
        const response = await fetch(`http://localhost:5000/patient/appointment/FollowUpRequested`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': accessToken,
            },
        });

        if (response.status === 200) {
            const data = await response.json();
            setAppointments(data);
        } else {
            throw new Error('Error filtering appointments by status');
        }
    };*/
    
    

    useEffect(() => {
        getPastAppointments();
        fetchPatientDetailsForAppointments();
    }, []);

    const handleScheduleFollowUp = (appointment) => {
        setSelectedAppointment({appointment});
        setShowFollowUpSection(true);
    };

    const handleFollowUpDateTimeChange = (e) => {
        setFollowUpDateTime(e.target.value);
    };

    const handleCreateFollowUp = async () => {
        const { appointment} = selectedAppointment;
        const follow = new Date(followUpDateTime); // Assuming appointment is a valid DateTime string
        const utcDateTime = new Date(followUpDateTime).toISOString();
        const followUpDate = follow.toLocaleDateString('en-GB', { 
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
      });
        const result = await createFollowUp(appointment, utcDateTime, followUpDate);
        setSelectedAppointment(null);
        setShowFollowUpSection(false);
    
        if (result.success) {
            window.alert("Appointment Successfully added");
        } else {
            if (result.message === 'You already sent a follow-up request with the same date and time') {
                window.alert(result.message);
            } else if (result.message === 'Follow-up date is in the past') {
                window.alert(result.message);
            }
        }
        setFollowUpDateTime('');
        await getPastAppointments();
    };
    
    const getScheduledAppointments = async (currentUser) => {
        const response = await fetch(`http://localhost:5000/doctor/appointments/FollowUpRequested`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': accessToken,
            },
        });

        if (response.status === 200) {
            const data = await response.json();
            setScheduled(data);
            //console.log("data data", data)
        } else {
            throw new Error('Error filtering appointments by status');
        }
    };

    
    const handleShowFollowUpBtn = async (event) => {
        const currentUser = username
        console.log(username)
        await getScheduledAppointments(username);
        setShowAppointments(true);
    };

    function formatTimeRange(dateTimeString) {
        const startDate = new Date(dateTimeString);
    
        // Extract start time in local time zone
        const startTime = startDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    
        // Calculate end date (60 minutes later)
        const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);
    
        // Extract end time in local time zone
        const endTime = endDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    
        // Format the time range
        const formattedTimeRange = `${startTime} - ${endTime}`;
    
        return formattedTimeRange;
    }
    
    
    // Helper function to pad zero for single-digit hours and minutes
    function padZero(number) {
        return number < 10 ? `0${number}` : `${number}`;
    }
    
    // Example usage:
    const dateTimeString = "2023-02-02T06:00:00.000Z";
    const formattedTimeRange = formatTimeRange(dateTimeString);
    console.log(formattedTimeRange);
    

    //Authenticate
    if (load) {
        return (<div>Loading</div>)
    }    

    // Render the component
    return (
        <div>
            <h2>Schedule Follow Up Appointment</h2>
            <button className={styles['button-schedule']}  onClick={() => {
                                handleShowFollowUpBtn();
                                setShowTable(!showTable);
                            }}> My Scheduled Follow Ups</button>
            <br/>
            <br/>
            <table>
                <thead>
                    <tr>
                        <th>Patient</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Time</th>
                        <th>Follow Up</th>
                    </tr>
                </thead>
                <tbody>
                    {appointments.map((appointment) => (
                        <tr key={appointment._id}>
                            <td>{appointment.name}</td>
                            <td>{appointment.date}</td>
                            <td>{appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}</td>
                            <td>{formatTimeRange(appointment.time)}</td>
                            <td>
                                <button className={styles['button-schedule']}
                                    onClick={() => handleScheduleFollowUp(appointment)}
                                >
                                    Schedule a Follow Up
                                </button>
                            </td>
                        </tr>
                    ))}
                    
                </tbody>
            </table>
            <br/>
            <br/>
            {showTable && 
                            <table>
                            <thead>
                            <tr>
                                <th>Doctor</th>
                                <th>Patient</th>
                                <th>Follow Up Date</th>
                                <th>Follow Up Time</th>
                                <th>Status</th>
                            </tr>
                            </thead>
                            <tbody>
                                {scheduledFollowUps &&
                                    scheduledFollowUps.map((followUp) => (
                                        <tr key={followUp._id}>
                                            <td>{followUp.doctor_username}</td>
                                            <td>{followUp.name}</td>
                                            <td>{followUp.date}</td>
                                            <td>{formatTimeRange(followUp.time)}</td>
                                            <td>{followUp.status}</td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                        }
            {showFollowUpSection && (
                <div className={styles['div-schedule']}>
                    <h2>Follow Up Details</h2>
                    <h4 >Patient : </h4>
                    <p> {selectedAppointment.appointment.patient_username}</p>
                    <h4>Appointment Time:</h4>
                    <p> {formatTimeRange(selectedAppointment.appointment.time)}</p>
                    <h2>Enter Follow Up Date and Time</h2>
                    <br/>
                    <input
                        type="datetime-local"
                        value={followUpDateTime}
                        onChange={handleFollowUpDateTimeChange}
                    />
                    <br/>
                    <br/>
                    <button className={styles['button-schedule']} onClick={handleCreateFollowUp}>Submit Follow Up</button>
                </div>
            )}
        </div>
    );
};

export default ScheduleFollowUp;
