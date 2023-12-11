import React, { useState, useEffect } from 'react';
import styles from './AcceptRejectFollowUp.module.css'
// Axios
import axios from 'axios';
// React Router DOM
import { useNavigate } from 'react-router-dom';

const AcceptRejectFollowUp = () => {
    const [followUps, setFollowUps] = useState([]);
    const [selectedFollowUp, setselectedFollowUp] = useState(null);
    const [followUpDateTime, setFollowUpDateTime] = useState('');
    const [famMem, setFamMem] = useState([]);
    const [loading, setLoading] = useState(true);
    const [requestedFollowUps, setRequested] = useState([]);

    const navigate = useNavigate();
    //Authenticate part
    const accessToken = sessionStorage.getItem('accessToken');
    const [load, setLoad] = useState(true);
    const [username, setUsername] = useState('');


    useEffect(() => {
        const getRequestedFollowUps = async () => {
            try {
                if (!accessToken) {
                    throw new Error('No access token provided');
                }

                const response = await fetch(`http://localhost:5000/doctor/acceptRejectFollowUp/viewRequestedFollowUps`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': accessToken,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setFollowUps(data);
                } else {
                    throw new Error('Error getting the requested followUps');
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                if (error.message === 'No access token provided') {
                    // Redirect the user to the login page or take appropriate action
                    navigate('/login');
                }
            } finally {
                setLoad(false);
            }
        };

        getRequestedFollowUps();
    }, [accessToken]);


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
                setUsername(response.data.username);
            })
            .catch((error) => {
                navigate('/login');

            });
    }

    const xTest = checkAuthentication();

    useEffect(() => {
        const fetchFamilyMembers = async () => {
            try {
                const response = await axios.get('http://localhost:5000/doctor/acceptRejectFollowUp/UnlinkedFamilyMembers', {
                    headers: {
                        'Authorization': accessToken,
                        'Content-Type': 'application/json',
                    },
                });


                console.log('API Response:', response.data);
                setFamMem(response.data);

                console.log("kokooooooo", response.data)
                setLoading(false);
            } catch (error) {
                console.error('Error fetching family members:', error);
                setLoading(false);
            }
        };

        if (accessToken) {
            fetchFamilyMembers();
        } else {
            // Handle the case where no access token is available (redirect to login or take appropriate action)
            console.error('No access token provided');
            navigate('/login');
        }
    }, [accessToken, navigate]);

    const acceptFollowUp = async (FollowUpID, appointmentID) => {
        if (!accessToken) {
            console.error('No access token provided');
            navigate('/login');
            return { success: false, message: 'No access token provided' };
        }

        try {
            const response = await fetch('http://localhost:5000/doctor/acceptRejectFollowUp/acceptFollowUp', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': accessToken,
                },
                body: JSON.stringify({ FollowUpID, appointmentID }),
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Follow-up accepted:', result);
                window.location.reload();
                return { success: true };
            } else {
                const errorData = await response.json();
                console.error('Error:', errorData.message);
                console.log('error', errorData);
                return { success: false, message: 'Follow-up acceptance failed' };
            }
        } catch (error) {
            console.error('Network error:', error.message);
            return { success: false, message: 'Network error' };
        }
    };

    const rejectFollowUp = async (FollowUpID, appointmentID) => {
        if (!accessToken) {
            console.error('No access token provided');
            navigate('/login');
            return { success: false, message: 'No access token provided' };
        }

        try {
            const response = await fetch('http://localhost:5000/doctor/acceptRejectFollowUp/rejectFollowUp', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': accessToken,
                },
                body: JSON.stringify({ FollowUpID, appointmentID }),
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Follow-up rejected:', result);
                window.location.reload();
                return { success: true };
            } else {
                const errorData = await response.json();
                console.error('Error:', errorData.message);
                console.log('error', errorData);
                return { success: false, message: 'Follow-up rejection failed' };
            }
        } catch (error) {
            console.error('Network error:', error.message);
            return { success: false, message: 'Network error' };
        }
    };


    const createAppointment = async (FollowUpID, appointmentID) => {
        if (!accessToken) {
            // Handle the case where no access token is provided, e.g., redirect to login
            console.error('No access token provided');
            // Redirect the user to the login page or take appropriate action
            navigate('/login');
            return { success: false, message: 'No access token provided' };
        }
        const appointmentData = {
            patient_username: followUps.patient_username,
            doctor_username: followUps.doctor_username,
            date: followUps.followUpDateTime.toString(),
            status: "upcoming",
            time: followUps.followUpDateTime,
            name: appointmentID.name,
            price: 0,
            //moshkela 
            booked_by: appointmentID.booked_by,
            isFollowUp: FollowUpID
        };

        console.log('Appointment Data:', appointmentData);

        try {
            const response = await fetch('http://localhost:5000/doctor/acceptRejectFollowUp/addAppointment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': accessToken,
                },
                body: JSON.stringify(appointmentData),
            });

            // Check if the response is a successful JSON response
            if (response.ok) {
                const result = await response.json();
                console.log('Appointment created:', result);
                return { success: true };
            } else {
                const errorData = await response.json();
                console.error('Error:', errorData.message);
                console.log('error', errorData);
            }
        } catch (error) {
            console.error('Network error:', error.message);
            return { success: false, message: 'Network error' };
        }

    };

    const handleCreateAppointment = async () => {
        const { FollowUpID, appointmentID } = selectedFollowUp;
        const result = await createAppointment(FollowUpID, appointmentID);
        setselectedFollowUp(null);
        setShowFollowUpSection(false);

        if (result.success) {
            window.alert("Appointment added Successfully");
        } else {
            result.message === 'Appointment addition failed'
            window.alert(result.message);

        }

        setFollowUpDateTime('');
    };
    const handleAcceptFollowUp = async (FollowUpID, appointmentID) => {
        const result = await acceptFollowUp(FollowUpID, appointmentID);

        if (result.success) {
            window.alert('Follow-up accepted successfully');
        } else {
            window.alert(result.message);
        }
    };

    const handleRejectFollowUp = async (FollowUpID, appointmentID) => {
        const result = await rejectFollowUp(FollowUpID, appointmentID);

        if (result.success) {
            window.alert('Follow-up rejected successfully');
        } else {
            window.alert(result.message);
        }
    };
    const getPatientName = (patientUsername) => {
        if (!famMem || !Array.isArray(famMem)) {
            // If famMem is not defined or not an array, handle it accordingly
            console.error('Family members data is not available.');
            return patientUsername;
        }

        const familyMember = famMem.find((member) => member.national_id === patientUsername);

        // Check if the family member with the given username is found
        if (familyMember) {
            return familyMember.name;
        } else {
            // If not found, return the original username
            return patientUsername;
        }
    };
    //Authenticate
    if (load || loading) {
        return (<div>Loading</div>)
    }

    // Render the component
    return (
        <div>
            <h2>Requested Follow Ups </h2>

            <br />
            <br />
            <table>
                <thead>
                    <tr>
                        <th>Patient</th>
                        <th>Date time</th>
                        <th></th>

                    </tr>
                </thead>
                <tbody>
                    {followUps.map((followUp) => (
                        <tr key={followUp._id}>
                            <td>{getPatientName(followUp.patient_username)}</td>
                            <td>{followUp.followUpDateTime}</td>

                            <td>
                                <button
                                    className={styles['button-schedule']}
                                    onClick={() => handleAcceptFollowUp(followUp._id, followUp.appointment_ID)}
                                >
                                    Accept
                                </button>
                                &nbsp; {/* Non-breaking space */}
                                <button
                                    className={styles['button-schedule']}
                                    onClick={() => handleRejectFollowUp(followUp._id, followUp.appointment_ID)}
                                >
                                    Reject
                                </button>
                            </td>
                        </tr>
                    ))}

                </tbody>
            </table>
            <br />
            <br />
        </div>
    );
};

export default AcceptRejectFollowUp;
