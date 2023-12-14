import React, { useState, useEffect } from 'react';
import styles from './RequestFollowUp.module.css'
// Axios
import axios from 'axios';
// React Router DOM
import { useNavigate } from 'react-router-dom';

const RequestFollowUp = () => {
    const [appointments, setAppointments] = useState([]);
    const [followUp, setFollowUp] = useState([]);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [followUpDateTime, setFollowUpDateTime] = useState('');
    const [showFollowUpSection, setShowFollowUpSection] = useState(false);
    const [selectedFamilyMember, setSelectedFamilyMember] = useState('');
    const [famMem, setFamMem] = useState('');
    const [loading, setLoading] = useState(true);
    //const [username, setUsername] = useState("");

    const [showTable, setShowTable] = useState(false);
    const [requestedFollowUps, setRequested] = useState([]);
    const [showAppointments, setShowAppointments] = useState(false);

    // const currentUser = "iaitchison1";
    const navigate = useNavigate();
    //Authenticate part
    const accessToken = sessionStorage.getItem('accessToken');
    const [load, setLoad] = useState(true);
    const [username, setUsername] = useState('');


    useEffect(() => {
        const getPastAppointments = async () => {
            try {
                if (!accessToken) {
                    throw new Error('No access token provided');
                }
    
                const response = await fetch(`http://localhost:5000/patient/requestFollowUp/viewPastAppointment`, {
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
    
        getPastAppointments();
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

    useEffect(() => {
        const fetchFamilyMembers = async () => {
          try {
            const response = await axios.get('http://localhost:5000/patient/viewFamilyMembers/', {
              headers: {
                'Authorization': accessToken,
                'Content-Type': 'application/json',
              },
            });
      
            setFamMem(response.data);
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

    const createFollowUp = async (doctorUsername, appointmentTime, followUpTime, appointmentID,appointmentName , appointmentPatient_username) => {
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
            const response = await fetch('http://localhost:5000/patient/requestFollowUp/requestFollowUp', {
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
   

    const handleFollowUpDateTimeChange = (e) => {
        setFollowUpDateTime(e.target.value);
    };

    const handleCreateFollowUp = async () => {
        const { doctorUsername, appointmentTime, appointmentID, appointmentName , appointmentPatient_username} = selectedAppointment;
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
    };

    const handleRequestFollowUp = (doctorUsername, appointmentTime, appointmentID,appointmentName,appointmentPatient_username) => {
        setSelectedAppointment({ doctorUsername, appointmentTime, appointmentID ,appointmentName,appointmentPatient_username });
        setShowFollowUpSection(true);
    };

    // const handleFamilyMemberChange = (e) => {
    //     setSelectedFamilyMember(e.target.value);
    // };



    //Authenticate
    if (load || loading) {
        return (<div>Loading</div>)
    }

    // Render the component
    return (
        <div>
            <h2>Request Follow Up Appointment</h2>
          
            <br />
            <br />
            <table>
                <thead>
                    <tr>
                        <th>Patient</th>
                        <th>Doctor</th>
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
                            <td>{appointment.doctor_username}</td>
                            <td>{appointment.date}</td>
                            <td>{appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}</td>
                            <td>{appointment.time}</td>
                           
              <td>
                                <button
                                    className={styles['button-schedule']}
                                    onClick={() => handleRequestFollowUp(appointment.doctor_username, appointment.time, appointment._id, appointment.name,appointment.patient_username)}
                                >
                                    Request a Follow Up
                                </button>
                            </td>
                        </tr>
                    ))}

                </tbody>
            </table>
            <br />
            <br />
           
            {showFollowUpSection && (
                <div className={styles['div-schedule']}>
                    <h2>Follow Up Details</h2>
                    <h4 >Patient : </h4>
                    <p> {selectedAppointment.appointmentName}</p>
                    <h4 >Doctor : </h4>
                    <p> {selectedAppointment.doctorUsername}</p>
                    <h4>Appointment Time:</h4>
                    <p> {selectedAppointment.appointmentTime}</p>
                    <h2>Enter Follow Up Date and Time</h2>
                    <br />
                    <input
                        type="datetime-local"
                        value={followUpDateTime}
                        onChange={handleFollowUpDateTimeChange}
                    />
                    <br />
                    <br />
                    <button className={styles['button-schedule']} onClick={handleCreateFollowUp}>Submit Follow Up</button>
                </div>
            )}
        </div>
    );
};

export default RequestFollowUp;
 // function to get past appointments
    // const getScheduledFollowUp = async (currentUser) => {
    //     const response = await fetch(`http://localhost:5000/patient/appointment/FollowUpRequested`, {
    //         method: 'GET',
    //         headers: {
    //             'Content-Type': 'application/json',
    //             'Authorization': accessToken,
    //         },
    //     });

    //     if (response.status === 200) {
    //         const data = await response.json();
    //         setAppointments(data);
    //     } else {
    //         throw new Error('Error filtering appointments by status');
    //     }
    // };


    // const handleRequestFollowUp = (patientUsername, appointmentTime) => {
    //     setSelectedAppointment({ patientUsername, appointmentTime });
    //     setShowFollowUpSection(true);
    // };
        // const getScheduledAppointments = async (currentUser) => {
    //     const response = await fetch(`http://localhost:5000/patient/requestFollowUp/getFollowUps`, {
    //         method: 'GET',
    //         headers: {
    //             'Content-Type': 'application/json',
    //             'Authorization': accessToken,
    //         },
    //     });

    //     if (response.status === 200) {
    //         const data = await response.json();
    //         setRequested(data);
    //         //console.log("data data", data)
    //     } else {
    //         throw new Error('Error filtering appointments by status');
    //     }
    // };
    
    // const handleShowFollowUpBtn = async (event) => {
    //     const currentUser = username
    //     await getScheduledAppointments(username);
    //     setShowAppointments(true);
    // };
    // {showTable &&
    //     <table>
    //         <thead>
    //             <tr>
    //                 <th>Doctor</th>
    //                 <th>Patient</th>
    //                 <th>Follow Up Date</th>
    //                 <th>Appointment Date</th>
    //                 <th>Status</th>
    //             </tr>
    //         </thead>
    //         <tbody>
    //             {requestedFollowUps &&
    //                 requestedFollowUps.map((followUp) => (
    //                     <tr key={followUp._id}>
    //                         <td>{followUp.doctor_username}</td>
    //                         <td>{followUp.patient_username}</td>
    //                         <td>{followUp.followUpDateTime}</td>
    //                         <td>{followUp.appointmentDateTime}</td>
    //                         <td>{followUp.status}</td>
    //                     </tr>
    //                 ))}
    //         </tbody>
    //     </table>
    // }
    // <button className={styles['button-schedule']} onClick={() => {
    //     handleShowFollowUpBtn();
    //     setShowTable(!showTable);
    // }}> My Scheduled Follow Ups</button>

    // const handleRequestFollowUp3 = async (doctorUsername, appointmentTime, appointmentID) => {
    //     event.preventDefault();
    //     setMessage('');
    //     setError('');

    //     const follow = {
    //         doctor_username: doctorUsername,
    //         patient_username: username,
    //         appointmentDateTime: appointmentTime,
    //         followUpDateTime: followUpDateTime,
    //         appointment_ID: appointmentID,

    //     };
    //     try {
    //         const response = await fetch('http://localhost:5000/patient/requestFollowUp/requestFollowUp', {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 'Authorization': accessToken,
    //             },
    //             body: JSON.stringify(follow),

    //         });

    //         console.log(response);

    //         if (response.status === 201) {

    //             setIsSubmitted(true);
    //             setMessage('FollowUp requested successfully!');

    //             const data = await response.json();
    //         }
    //         else {

    //             setError('An error occurred while requsting the followUp.');
    //         }
    //     } catch (error) {
    //         console.log("There is an error");
    //         setError(error.message);
    //     }
    // };
        // const handleRequestFollowUp2 = async () => {
    //     const response = await fetch('http://localhost:5000/patient/requestFollowUp/requestFollowUp', {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json',
    //             'Authorization': accessToken,
    //         },
    //     });

    //     if (response.ok) {
    //         setFollowUp(true);
    //         window.location.reload();
    //     }
    //     else {
    //         // Handle any errors from the backend
    //         console.error('Error requesting a followUp :', response.statusText);
    //     }


    // };
    

//     <td>
//     {/* Add a dropdown box to choose family member */}
//     <select value={selectedFamilyMember} onChange={handleFamilyMemberChange}>
//       <option value="">Select Family Member</option>
//       <option value={username}>Myself</option>
//       {famMem && famMem.length > 0 ? (
//         famMem.map((member) => (
//           <option key={member.id} value={member.username}>
//             {member.name}
//           </option>
//         ))
//       ) : (
//         <option value="" disabled>
//           No family members available
//         </option>
//       )}
//     </select>
//   </td>
//                      {/* <th>Family Member</th>