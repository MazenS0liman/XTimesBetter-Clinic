import React, { useState, useEffect } from 'react';
import styles from './viewAppointmentsPage.module.css';
import AppointmentList from '../../../components/appointmentList/appointmentList';

// Axios
import axios from 'axios';

// React Router DOM
import { useNavigate } from 'react-router-dom';


const ViewAppointments = () => {

    // State variables

    const [appointments, setAppointments] = useState([]);
    const [showAppointments, setShowAppointments] = useState(false);
    const [allAppointments, setShowAllAppointments] = useState([]);
    const [selectedDate, setSelectedDate] = useState('');
    const [status, setStatus] = useState('');
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

    // Function to get all my appointments.
    useEffect(() => {
        const fetchAllDoctors = async () => {
            const response = await fetch(`http://localhost:5000/doctor/appointments/getAppointments`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': accessToken,
                },
            });

            if (response.status === 200) {
                const data = await response.json();
                setAppointments(data);
                setShowAppointments(data);
                setShowAllAppointments(data);
            } else {
                throw new Error('Error filtering appointments by status');
            }
        }
        fetchAllDoctors();
    }, []);

    // function to filter appointments by status
    const getUpcomingAppointments = async (currentUser) => {
        const response = await fetch(`http://localhost:5000/doctor/appointments/upcomingAppointments`, {
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

    const getPastAppointments = async (currentUser) => {
        const response = await fetch(`http://localhost:5000/doctor/appointments/pastAppointments`, {
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

    // function to handle form submit
    const handleUpcomingAppointments = async (event) => {
        const currentUser = "iaitchison1"
        await getUpcomingAppointments(currentUser);
        setShowAppointments(true);
    };

    const handlePastAppointments = async (event) => {
        const currentUser = "iaitchison1"
        await getPastAppointments(currentUser);
        setShowAppointments(true);
    };

    const handleCancelAppointment = async (appointmentId) => {
        try {
            // Call your cancelAppointment API endpoint with the appointment ID
            const response = await axios.post('http://localhost:5000/doctor/appointments/cancelAppointment',
                { appointmentID: appointmentId }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': accessToken,
                },
            });

            if (response.status === 200) {
                setAppointments(prevAppointments => prevAppointments.filter(appointment => appointment._id !== appointmentId));
                console.log('Appointment canceled successfully');
            } else {
                console.error('Error canceling appointment');
            }
        } catch (error) {
            console.error('Error canceling appointment:', error.message);
        }
    }

    const handleRescheduleAppointment = async (appointmentId) => {
        const appData = { appointmentID: appointmentId };
        console.log('Rescheduling Appointment with ID:', appointmentId);
        navigate('/doctor/rescheduleTimeSlots', { state: appData });
    };

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

    // Filter By Status Code
    // function to filter appointments by status
    const filterAppointmentsByStatus = async (chosenStatus) => {
        if (!chosenStatus) {
            // Handle case where status is not selected
            return;
        }

        const url = `http://localhost:5000/doctor/filterAppointmentsByStatusForDoctor/filterByStatus?status=${chosenStatus}`;

        const response = await fetch(url, {
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

    const handleStatusChange = (e) => {
        const chosenStatus = e.target.value;
        setStatus(chosenStatus);
        filterAppointmentsByStatus(chosenStatus);
        setShowAppointments(true);
    };

    useEffect(() => {
        if (showAppointments) {
            filterAppointmentsByStatus(status);
        }
    }, [showAppointments, status]);

    // Filter By Date Code
    const filterAppointmentsByDate = async (chosenDate) => {
        const formattedDate = formatDate(chosenDate);
        console.log('Formatted Date:', formattedDate);

        try {
            const response = await fetch(`http://localhost:5000/doctor/filterAppointmentsByDateForDoctor/filter?date=${encodeURIComponent(formattedDate)}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': accessToken,
                },
            });

            if (response.status === 200) {
                const data = await response.json();
                console.log('Filtered Appointments:', data);
                setAppointments(data);
            } else {
                console.error('Error filtering appointments by date:', response.status);
            }
        } catch (error) {
            console.error('Error filtering appointments:', error.message);
        }
    };


    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };


    useEffect(() => {
        if (showAppointments && selectedDate) {
            filterAppointmentsByDate(selectedDate);
        }
    }, [showAppointments, selectedDate]);

    // Handling follow up
    const [followUp, setFollowUp] = useState([]);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [followUpDateTime, setFollowUpDateTime] = useState('');
    const [showFollowUpSection, setShowFollowUpSection] = useState(false);

    const createFollowUp = async (doctorUsername, appointmentTime, followUpTime, appointmentID, appointmentName, appointmentPatient_username) => {
        if (!accessToken) {
            // Handle the case where no access token is provided, e.g., redirect to login
            console.error('No access token provided');
            // Redirect the user to the login page or take appropriate action
            navigate('/login');
            return { success: false, message: 'No access token provided' };
        }
        // hena el moshkela 
        const followUpData = {
            doctor_username: doctorUsername,
            patient_username: appointmentPatient_username,
            appointmentDateTime: appointmentTime,
            followUpDateTime: followUpTime,
            appointment_ID: appointmentID,
        };

        console.log('FollowUp Data:', followUpData);

        try {
            const response = await fetch('http://localhost:5000/doctor/appointments/FollowUpRequested', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': accessToken,
                },
                body: JSON.stringify(followUpData),
            });

            // Check if the response is a successful JSON response
            if (response.ok) {
                const result = await response.json();
                console.log('Follow-up requested:', result);
                window.location.reload();
                return { success: true };
            } else {
                const errorData = await response.json();
                console.error('Error:', errorData.message);
                console.log('error', errorData);

                if (errorData.message === 'Duplicate follow-up appointment found') {
                    return { success: false, message: 'You already sent a follow-up request with the same date and time' };
                } else if (errorData.message === 'Appointment date and time are in the past') {
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

    const handleRequestFollowUp = (doctorUsername, appointmentDate, appointmentTime, appointmentID, appointmentName, appointmentPatient_username) => {
        setSelectedAppointment({
            doctorUsername,
            appointmentDate,
            appointmentTime,
            appointmentID,
            appointmentName,
            appointmentPatient_username,
        });
        setShowFollowUpSection(true);
    };

    useEffect(() => {
        if (selectedAppointment !== null) {
            const followUpSection = document.getElementById('followUpSection');
            followUpSection.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
        }
    }, [selectedAppointment]);


    const handleFollowUpDateTimeChange = (e) => {
        setFollowUpDateTime(e.target.value);
    };

    const handleCreateFollowUp = async () => {
        const { doctorUsername, appointmentTime, appointmentID, appointmentName, appointmentPatient_username } = selectedAppointment;
        const result = await createFollowUp(doctorUsername, appointmentTime, followUpDateTime, appointmentID, appointmentName, appointmentPatient_username);
        setSelectedAppointment(null);
        setShowFollowUpSection(false);

        if (result.success) {
            window.alert("FollowUp requested Successfully");
        } else {
            if (result.message === 'You already sent a follow-up request with the same date and time') {
                window.alert(result.message);
            } else if (result.message === 'Follow-up date is in the past') {
                window.alert(result.message);
            }
        }

        setFollowUpDateTime('');
        setShowFollowUpSection(false);
    };

    const handleCloseFollowUp = () => {
        setShowFollowUpSection(false);
        setSelectedAppointment(null);
        setFollowUpDateTime('');
    };


    const handleClearFilters = () => {
        setAppointments(allAppointments);
        setShowAppointments(allAppointments);
        setStatus('');
        setSelectedDate('');
    };

    //Authenticate
    if (load) {
        return (<div>Loading</div>)
    }

    // Render the component
    return (
        <div>
            <h1>Appointments</h1>
            <div className={styles['clear-filter-container']}>
                <div className={styles['clear-button-container']}>
                    {
                        <button className={styles['clear-button']} type="button" onClick={handleClearFilters}>
                            Clear
                        </button>
                    }
                </div>

                <div className={styles['filter-container']}>
                    <div className={styles['filter-item']}>
                        <label>Filter by Status: </label>
                        <select value={status} onChange={handleStatusChange}>
                            <option value="">Choose Status</option>
                            <option value="upcoming">Upcoming</option>
                            <option value="completed">Completed</option>
                            <option value="canceled">Canceled</option>
                            <option value="reschedule">Reschedule</option>
                        </select>
                    </div>
                    <div className={styles['filter-item']}>
                        <label>Filter by Date: </label>
                        <input
                            id="datePicked"
                            className={styles['date-container']}
                            type="date"
                            name="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            required
                        />
                    </div>
                </div>
            </div>
            <div className="appointment-table-container">
                {showAppointments &&
                    <table>
                        <thead>
                            <tr>
                                <th>Patient</th>
                                <th>Date</th>
                                <th>Status</th>
                                <th>Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {appointments.map((appointment) => (
                                <tr key={appointment._id}>
                                    <td>{appointment.name}</td>
                                    <td>{appointment.date}</td>
                                    <td>{appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}</td>
                                    <td>{formatTime(appointment.time)}</td>
                                    <td>
                                        {appointment.status === 'upcoming' && (
                                            <button className={styles['button-blue']} onClick={() => handleRescheduleAppointment(appointment._id)}>Reschedule</button>
                                        )}

                                        {appointment.status === 'upcoming' && (
                                            <button className={styles['button-red']} onClick={() => handleCancelAppointment(appointment._id)}>Cancel</button>
                                        )}

                                        {appointment.status === 'completed' && (
                                            <button
                                                className={styles['button-schedule']}
                                                onClick={() => handleRequestFollowUp(appointment.doctor_username, appointment.date, appointment.time, appointment._id, appointment.name, appointment.patient_username)}
                                            >
                                                Schedule Follow Up
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                }
            </div>


            {showFollowUpSection && selectedAppointment && (
                <div id="followUpSection" className={styles['div-schedule']}>
                    <h2>Follow Up Details</h2>
                    <div className={styles['follow-up-details']}>
                        <div className={styles['details-container']}>
                            <div className={styles['detail-item']}>
                                <h4>Patient:</h4>
                                <p>{selectedAppointment.appointmentName}</p>
                            </div>
                            <div className={styles['detail-item']}>
                                <h4>Doctor:</h4>
                                <p>{selectedAppointment.doctorUsername}</p>
                            </div>
                            <div className={styles['detail-item']}>
                                <h4>Appointment Date:</h4>
                                <p>{selectedAppointment.appointmentDate}</p>
                            </div>
                            <div className={styles['detail-item']}>
                                <h4>Appointment Time:</h4>
                                <p>{formatTime(selectedAppointment.appointmentTime)}</p>
                            </div>
                        </div>
                    </div>
                    <h2>Enter Follow Up Date and Time</h2>
                    <br />
                    <input
                        type="datetime-local"
                        value={followUpDateTime}
                        onChange={handleFollowUpDateTimeChange}
                    />
                    <br />
                    <br />
                    <button className={styles['button-blue']} onClick={handleCreateFollowUp}>Submit Follow Up</button>
                    <button className={styles['button-red']} onClick={() => handleCloseFollowUp()}>Cancel</button>
                </div>
            )}
        </div>
    );
};

export default ViewAppointments;