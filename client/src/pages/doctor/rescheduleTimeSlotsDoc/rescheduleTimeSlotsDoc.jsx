import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './rescheduleTimeSlotsDoc.module.css';

import { Button, Typography } from '@mui/joy';

// FontAwesome Components
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const RescheduleAppointment = () => {
    const location = useLocation();
    const appointmentID = location.state.appointmentID;
    console.log("Appointment ID :", appointmentID)

    const [appointmentDetails, setAppointmentDetails] = useState({});
    const [doctorUsername, setDoctorUsername] = useState("");
    const [availableSlots, setAvailableSlots] = useState([]);
    const [rescheduleSuccess, setRescheduleSuccess] = useState(false);
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

    const getAppointment = async () => {
        try {
            const response = await axios.get(
                `http://localhost:5000/patient/appointment/getAppointmentByID?appointment_id=${appointmentID}`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': accessToken,
                    },
                }
            );

            if (response.status === 200) {
                const data = response.data;
                setAppointmentDetails(data);
                setDoctorUsername(data.doctor_username);
            } else {
                throw new Error('Error fetching appointment by ID');
            }
        } catch (error) {
            console.error('Error fetching appointment by ID:', error.message);
            // Handle errors as needed
        }
    };

    useEffect(() => {
        getAppointment();
    }, []);

    console.log("App Details", appointmentDetails);


    const getAvailableAppointments = async () => {
        const response = await fetch(`http://localhost:5000/patient/doctorList/DoctorAppointments?doctor_username=${doctorUsername}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.status === 200) {
            const data = await response.json();
            const formattedAppointments = data.map(appointment => {
                const dateTime = new Date(appointment); // Assuming appointment is a valid DateTime string
            
                const date = new Intl.DateTimeFormat('en-GB', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                }).format(dateTime);
            
                const timeSlotBegin = new Intl.DateTimeFormat('en-US', {
                    hour: 'numeric',
                    minute: 'numeric',
                    hour12: true,
                    timeZone: 'UTC', // Use UTC for the initial time
                }).format(dateTime);
            
                const weekday = new Intl.DateTimeFormat('en-GB', {
                    weekday: 'long',
                }).format(dateTime);
            
                const timeSlotEnd = new Date(dateTime.getTime() + (60 * 60 * 1000));
                const timeSlotEndFormatted = new Intl.DateTimeFormat('en-US', {
                    hour: 'numeric',
                    minute: 'numeric',
                    hour12: true,
                    timeZone: 'UTC', // Use UTC for the initial time
                }).format(timeSlotEnd);
            
                // Combine current and next hour time
                const combinedTime = `${timeSlotBegin} - ${timeSlotEndFormatted}`;
            
                return {
                    date,
                    combinedTime,
                    weekday,
                    timeSlotBegin,
                    appointment
                };
            });
            
            setAvailableSlots(formattedAppointments);

        } else {
            throw new Error('Error getting Doctor Appointments');
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (doctorUsername) {
                    await getAvailableAppointments();
                }
            } catch (error) {
                console.error('Error fetching available appointments:', error.message);
            }
        };

        fetchData();
    }, [appointmentDetails, doctorUsername]);


    console.log("Appointments : ", availableSlots)

    const handleRescheduleAppointment = async (selectedAppointment) => {
        try {
            const rescheduleData = {
                appointmentId: appointmentID,
                newDate: selectedAppointment.date,
                newTime: selectedAppointment.appointment,
            };

            console.log("resc data", rescheduleData);

            const response = await axios.post(
                'http://localhost:5000/doctor/appointments/rescheduleAppointment',
                rescheduleData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': accessToken,
                    },
                }
            );

            if (response.status === 200) {
                console.log('Appointment rescheduled successfully:', response.data);
                setRescheduleSuccess(true);
                await getAvailableAppointments();
            } else {
                console.error('Error rescheduling appointment:', response.data.message);
            }
        } catch (error) {
            console.error('Error rescheduling appointment:', error.message);
        }
    };

    useEffect(() => {
        if (rescheduleSuccess) {
            window.alert('Appointment rescheduled successfully.');
            setRescheduleSuccess(false);
            navigate(-1); // Navigate back to the previous page
        }
    }, [rescheduleSuccess, navigate]);



    if (load) {
        return (<div>Loading</div>)
    }

    return (
        <div>
             <div className={styles['header-container']}>
                <Button className={styles['back-button']} onClick={() => navigate(-1)}>
                    <FontAwesomeIcon icon={faArrowLeft} />
                </Button>
                <h1>Reschedule Appointment</h1>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>Day</th>
                        <th>Date</th>
                        <th>Time</th>
                    </tr>
                </thead>
                <tbody>
                    {availableSlots.map((appointment) => (
                        <tr key={appointment._id}>
                            <td>{appointment.weekday}</td>
                            <td>{appointment.date}</td>
                            <td>{appointment.combinedTime}</td>
                            <td>
                                <button className={styles["button-2"]} onClick={() => handleRescheduleAppointment(appointment)}>
                                    Reschedule
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default RescheduleAppointment;
