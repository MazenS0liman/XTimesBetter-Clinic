import React, { useState, useEffect } from 'react';

const ScheduleFollowUp = () => {
    const [appointments, setAppointments] = useState([]);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [followUpDateTime, setFollowUpDateTime] = useState('');
    const [showFollowUpSection, setShowFollowUpSection] = useState(false);

    const currentUser = "iaitchison1";

    const getPastAppointments = async () => {
        const response = await fetch(`http://localhost:5000/doctor/appointments/pastAppointments?doctor_username=${currentUser}`, {
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

    const createFollowUp = async (patientUsername, appointmentTime, followUpTime) => {
        const followUpData = {
            doctor_username: currentUser,
            patient_username: patientUsername,
            appointmentDateTime: appointmentTime,
            followUpDateTime: followUpTime,
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
            } else {
                const errorData = await response.json();
                console.error('Error:', errorData.message);
            }
        } catch (error) {
            console.error('Network error:', error.message);
        }
    };

    useEffect(() => {
        getPastAppointments();
    }, []);

    const handleScheduleFollowUp = (patientUsername, appointmentTime) => {
        setSelectedAppointment({ patientUsername, appointmentTime });
        setShowFollowUpSection(true);
    };

    const handleFollowUpDateTimeChange = (e) => {
        setFollowUpDateTime(e.target.value);
    };

    const handleCreateFollowUp = () => {
        const { patientUsername, appointmentTime } = selectedAppointment;
        createFollowUp(patientUsername, appointmentTime, followUpDateTime);
        setSelectedAppointment(null);
        setShowFollowUpSection(false);
    };

    

    // Render the component
    return (
        <div>
            <h2>Schedule Follow Up Appointment</h2>
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
                            <td>{appointment.patient_username}</td>
                            <td>{appointment.date}</td>
                            <td>{appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}</td>
                            <td>{appointment.time}</td>
                            <td>
                                <button
                                    onClick={() => handleScheduleFollowUp(appointment.patient_username, appointment.time)}
                                >
                                    Schedule a Follow Up
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {showFollowUpSection && (
                <div style={{ border: '1px solid #ccc', padding: '10px', margin: '10px' }}>
                    <h3>Follow Up Details</h3>
                    <p>Patient: {selectedAppointment.patientUsername}</p>
                    <p>Appointment Time: {selectedAppointment.appointmentTime}</p>
                    <h3>Enter Follow Up Date and Time</h3>
                    <input
                        type="datetime-local"
                        value={followUpDateTime}
                        onChange={handleFollowUpDateTimeChange}
                    />
                    <button onClick={handleCreateFollowUp}>Submit Follow Up</button>
                </div>
            )}
        </div>
    );
};

export default ScheduleFollowUp;
