import React, { useState, useEffect } from 'react';
import styles from './ViewAppointmentsPage.module.css';
import AppointmentList from '../../../components/appointmentList/appointmentList';

const ViewAppointments = () => {

    // State variables
    const [appointments, setAppointments] = useState([]);
    const [showAppointments, setShowAppointments] = useState(false);
    const [doctorName,setDoctorName] = useState("");

    // function to filter appointments by status
    const getUpcomingAppointments = async (currentUser) => {
        const response = await fetch(`http://localhost:5000/patient/appointment//upcomingAppointments?patient_username=${currentUser}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.status === 200) {
            const data = await response.json();
            setAppointments(data);
        } else {
            throw new Error('Error filtering appointments by status');
        }
    };

    const getPastAppointments = async (currentUser) => {
        const response = await fetch(`http://localhost:5000/patient/appointment/pastAppointments?patient_username=${currentUser}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.status === 200) {
            const data = await response.json();
            setAppointments(data);
        } else {
            throw new Error('Error filtering appointments by status');
        }
    };

    // function to handle form submit
    const handleUpcomingAppointments = async (event) => {
        const currentUser = "ahmed"
        await getUpcomingAppointments(currentUser);
        setShowAppointments(true);
    };

    const handlePastAppointments = async (event) => {
        const currentUser = "ahmed"
        await getPastAppointments(currentUser);
        setShowAppointments(true);
    };

    // Render the component
    return (
        <div>
            <h1>Appointments</h1>
            <button className={styles["button"]} type="submit" onClick={handleUpcomingAppointments}>Upcoming Appointments</button>
            <button className={styles["button-2"]} type="submit" onClick={handlePastAppointments}>Past Appointments</button>
            {showAppointments && 
                
                <table>
                <thead>
                  <tr>
                    <th>Patient</th>
                    <th>Doctor</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                    {
                        appointments.map((appointment) => {
                                return <AppointmentList key={appointment._id} appointment={appointment} />
                        })
                    }
                </tbody>
              </table>
            }
        </div>
    );
};

export default ViewAppointments;