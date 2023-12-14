import React, { useEffect, useState } from 'react';
import styles from './appointmentList.module.css';

const AppointmentList = ({ appointment, onCancel, onReschedule, accessToken }) => {
    const [patientName, setPatientName] = useState('');

    useEffect(() => {
        // Fetch patient details when the component mounts
        const fetchPatientDetails = async () => {
            try {
                const response = await fetch(`http://localhost:5000/patient/appointment/getPatientByUsername?patient_username=${appointment.patient_username}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': accessToken,
                    },
                });

                if (response.status === 200) {
                    const data = await response.json();
                    setPatientName(data.name);
                } else {
                    console.error('Error fetching patient details');
                }
            } catch (error) {
                console.error('Error fetching patient details:', error.message);
            }
        };

        fetchPatientDetails();
    }, [appointment.patient_username, accessToken]);

    // Function to format the time
    const formatTime = (timestamp) => {
        const dateTime = new Date(timestamp);

        const timeSlotBegin = new Intl.DateTimeFormat('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
            timeZone: 'UTC',
        }).format(dateTime);

        const timeSlotEnd = new Date(dateTime.getTime() + (60 * 60 * 1000));
        const timeSlotEndFormatted = new Intl.DateTimeFormat('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
            timeZone: 'UTC',
        }).format(timeSlotEnd);

        return `${timeSlotBegin} - ${timeSlotEndFormatted}`;
    };

    return (
        <tr key={appointment._id}>
            <td>{appointment.name}</td>
            <td>{appointment.doctor_username}</td>
            <td>{appointment.date}</td>
            <td>{appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}</td>
            <td>{formatTime(appointment.time)}</td>
            <td>
                {appointment.status === 'upcoming' && (
                    <button className={styles['button-red']} onClick={() => onCancel(appointment._id)}>Cancel</button>
                )}
            </td>
            <td>
                {appointment.status === 'upcoming' && (
                    <button className={styles['button-blue']} onClick={() => onReschedule(appointment._id)}>Reschedule</button>
                )}
            </td>
            
        </tr>
    );
};

export default AppointmentList;
