import React, { useState, useEffect } from 'react';
import styles from './ViewAppointmentsPage.module.css';
import AppointmentList from '../../../components/appointmentList/appointmentList';

// Axios
import axios from 'axios';

// React Router DOM
import { useNavigate } from 'react-router-dom';

const ViewAppointments = () => {

    // State variables
    const [appointments, setAppointments] = useState([]);
    const [showAppointments, setShowAppointments] = useState(false);
    const [doctorName, setDoctorName] = useState("");
    const [patientDetails, setPatientDetails] = useState({});
    const [selectedDate, setSelectedDate] = useState('');
    const [status, setStatus] = useState('');
    const [allAppointments, setShowAllAppointments] = useState([]);

    // To store the info of the appointment wanted to be rescheduled.
    const [selectedRescheduleAppointment, setSelectedRescheduleAppointment] = useState(null);

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
                'User-type': 'patient',
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
            const response = await fetch(`http://localhost:5000/patient/appointment/getAppointments`, {
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

    // function to get upcoming appointments
    const getUpcomingAppointments = async (currentUser) => {
        const response = await fetch(`http://localhost:5000/patient/appointment/upcomingAppointments`, {
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

    // function to get past appointments
    const getPastAppointments = async (currentUser) => {
        const response = await fetch(`http://localhost:5000/patient/appointment/pastAppointments`, {
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

    const getBookedAppointments = async (currentUser) => {
        const response = await fetch(`http://localhost:5000/patient/appointment/bookedAppointments`, {
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
        //const currentUser = "ahmed"
        const currentUser = username
        console.log(currentUser)
        await getUpcomingAppointments(currentUser);

        setShowAppointments(true);
    };

    const handlePastAppointments = async (event) => {
        //const currentUser = "ahmed"
        const currentUser = username
        await getPastAppointments(currentUser);
        setShowAppointments(true);
    };

    const handleBookedAppointments = async (event) => {
        //const currentUser = "ahmed"
        const currentUser = username
        await getBookedAppointments(currentUser);
        setShowAppointments(true);
    };

    const handleCancelAppointment = async (appointmentId) => {
        try {
            // Call your cancelAppointment API endpoint with the appointment ID
            const response = await axios.post('http://localhost:5000/patient/appointment/cancelAppointment',
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
        navigate('/patient/rescheduleTimeSlots', { state: appData });
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

    // Filter By Date Code
    const filterAppointmentsByDate = async (chosenDate) => {
        const formattedDate = formatDate(chosenDate);
        console.log('Formatted Date:', formattedDate);

        try {
            const response = await fetch(`http://localhost:5000/patient/filterAppointmentsByDateForPatient/filter?date=${encodeURIComponent(formattedDate)}`, {
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


    // Filter By Status Code
    // function to filter appointments by status
    const filterAppointmentsByStatus = async (chosenStatus) => {
        if (!chosenStatus) {
            // Handle case where status is not selected
            return;
        }

        const url = `http://localhost:5000/patient/filterAppointmentsByStatusForPatient/filterByStatus?status=${chosenStatus}`;

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

    // Clearing
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
                <button className={styles['clear-button']} type="button" onClick={handleClearFilters}>
                    Clear Filters
                </button>
                <div className={styles['filter-container']}>
                <div className={styles['filter-item']}>
                        <label>Filter by Status: </label>
                        <select
                            value={status}
                            onChange={handleStatusChange}
                        >
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
            <br></br>
            <br></br>
            <button className={styles["button"]} type="submit" onClick={handleUpcomingAppointments}>Upcoming Appointments</button>
            <button className={styles["button-2"]} type="submit" onClick={handlePastAppointments}>Past Appointments</button>
            <button className={styles["button-2"]} type="submit" onClick={handleBookedAppointments}>Booked Appointments</button>
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
                        {appointments.map((appointment) => (
                            <tr key={appointment._id}>
                                <td>{appointment.name}</td>
                                <td>{appointment.doctor_username}</td>
                                <td>{appointment.date}</td>
                                <td>{appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}</td>
                                <td>{formatTime(appointment.time)}</td>
                                <td>
                                    {appointment.status === 'upcoming' && (
                                        <button className={styles['button-red']} onClick={() => handleCancelAppointment(appointment._id)}>Cancel</button>
                                    )}
                                </td>
                                <td>
                                    {appointment.status === 'upcoming' && (
                                        <button className={styles['button-blue']} onClick={() => handleRescheduleAppointment(appointment._id)}>Reschedule</button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            }

        </div>
    );
};

export default ViewAppointments;