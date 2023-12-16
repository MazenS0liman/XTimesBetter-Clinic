import React, { useState, useEffect } from 'react';
import styles from './BookingFormPage.module.css';
import { useLocation, useNavigate } from 'react-router-dom';

// Axios
import axios from 'axios';

import { Button, Typography } from '@mui/joy';

// FontAwesome Components
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';


const BookAppointmentForm = () => {
    const location = useLocation();
    const appointment = location.state;
    console.log("app Info", appointment)

    const patient_username = appointment.currentPatient;
    const doctor_username = appointment.doctorUsername;
    const selectedAppointmentDate = appointment.bookAppointment.date;
    const selectedAppointmentTime = appointment.bookAppointment.dateTimeCombined;

    const [rowID, setRowID] = useState("")

    const [unlinkedfamilyMembers, setUnlinkedFamilyMembers] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);
    const [selectedUnlinkedFamilyMember, setSelectedUnlinkedFamilyMember] = useState('')

    const [linkedfamilyMembers, setLinkedFamilyMembers] = useState([]);
    //const [selectedOption2, setSelectedOption2] = useState('self');
    const [selectedLinkedFamilyMember, setSelectedLinkedFamilyMember] = useState('')

    const [doctors, setDoctors] = useState([]);
    //const [username, setUsername] = useState('');

    const [hourlyRate, setHourlyRate] = useState('');

    const [discount, setDiscount] = useState('');
    const [priceBefore, setPriceBefore] = useState('');

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

    useEffect(() => {
        const fetchUnlinkedFamilyMembers = async () => {
            const response = await fetch(`http://localhost:5000/patient/viewFamilyMembers//UnlinkedFamilyMembers`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': accessToken,
                },
            });

            const familyMembers = await response.json();
            if (response.ok) {
                setUnlinkedFamilyMembers(familyMembers);
            }
        };
        fetchUnlinkedFamilyMembers();
    }, [patient_username]);

    useEffect(() => {
        const fetchLinkedFamilyMembers = async () => {
            const response = await fetch(`http://localhost:5000/patient/viewFamilyMembers/LinkedFamilyMembers`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': accessToken,
                },
            });
            const familyMembers = await response.json();
            if (response.ok) {
                setLinkedFamilyMembers(familyMembers);
            }
        };
        fetchLinkedFamilyMembers();
    }, [patient_username]);

    const handlePatientAppointmentChange = (patientType) => {
        setSelectedOption(patientType);
        getHourlyRateByUsername(username, appointment.doctorUsername)
        setSelectedUnlinkedFamilyMember(''); // Reset selected family member when changing patient type
    };

    const handleFamilyMemberChange = (event) => {
        setSelectedUnlinkedFamilyMember(event.target.value);
        getHourlyRateByNationalID(event.target.value, appointment.doctorUsername)
    };

    const handleLinkedFamilyMemberChange = (event) => {
        setSelectedLinkedFamilyMember(event.target.value);
        getHourlyRateByUsername(event.target.value, appointment.doctorUsername)
    };

    const handleUpdatedFamily = (event) => {
        setFamilyMember(event.target.value);
        const selectedFamilyMember = allFamilyMembers.find(member => member._id === event.target.value);
    
        // Check the type of the selected family member
        if (selectedFamilyMember) {
            if (selectedFamilyMember.type === 'linked') {
                getHourlyRateByUsername(selectedFamilyMember.username, appointment.doctorUsername);
            } else if (selectedFamilyMember.type === 'unlinked') {
                getHourlyRateByNationalID(selectedFamilyMember.national_id, appointment.doctorUsername);
            }
        } else {
            // Handle the case where the selected family member is not found
            console.error('Selected family member not found in the allFamilyMembers list.');
        }
    };

    const getHourlyRateByUsername = async (patient_username, doctor_username) => {
        try {
            const response = await fetch(`http://localhost:5000/patient/appointment/getHourlyRateByUsername?patient_username=${patient_username}&doctor_username=${doctor_username}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                // console.log("Hourly Rate Data:", data); // Add this line for debugging

                // Ensure that data.hourlyRate is a valid number
                const hourlyRate = parseFloat(data.patient_hourlyRate);
                

                if (!isNaN(hourlyRate)) {
                    setHourlyRate(hourlyRate);
                    setPriceBefore(data.price_before);
                    setDiscount(data.package_discount);
                } else {
                    console.error('Invalid hourly rate:', data.hourlyRate);
                }
            } else {
                const errorData = await response.json();
                console.error('Error:', errorData.message);
            }
        } catch (error) {
            console.error('Network error:', error.message);
        }
    };

    const getHourlyRateByNationalID = async (nationalID, doctor_username) => {
        try {
            const response = await fetch(`http://localhost:5000/patient/appointment/getHourlyRateByUsername?patient_username=${nationalID}&doctor_username=${doctor_username}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                // console.log("Hourly Rate Data:", data); // Add this line for debugging

                // Ensure that data.hourlyRate is a valid number
                const hourlyRate = parseFloat(data.patient_hourlyRate);

                if (!isNaN(hourlyRate)) {
                    setHourlyRate(hourlyRate);
                    setPriceBefore(data.price_before);
                    setDiscount(data.package_discount);
                } else {
                    console.error('Invalid hourly rate:', data.hourlyRate);
                }
            } else {
                const errorData = await response.json();
                console.error('Error:', errorData.message);
            }
        } catch (error) {
            console.error('Network error:', error.message);
        }
    };

    const submitAppointment = async () => {

        const appointmentData = {
            doctor_username: appointment.doctorUsername ,
            doctorName: appointment.doctorName ,
            patient_username: username,
            date: appointment.bookAppointment.date,
            time: appointment.bookAppointment.appointment,
            // To be edited to include the patient name , which in this case is the currently logged in client
            name: username,
            price: hourlyRate,
            booked_by: username, 
            priceBefore : priceBefore,
            discount : discount
        };

        navigate('/patient/appointmentPayment', { state: appointmentData });

        // const appointmentData = {
        //     doctor_username: appointment.doctorUsername ,
        //     patient_username: username,
        //     date: appointment.bookAppointment.date,
        //     time: appointment.bookAppointment.appointment,
        //     // To be edited to include the patient name , which in this case is the currently logged in client
        //     name: username ,
        //     price: hourlyRate,
        //     booked_by: username
        // };

        // // console.log("appointment data",appointmentData)

        // try {
        //     const response = await fetch('http://localhost:5000/patient/appointment/createAppointment', {
        //         method: 'POST',
        //         headers: {
        //             'Content-Type': 'application/json',
        //         },
        //         body: JSON.stringify(appointmentData),
        //     });

        //     if (response.ok) {
        //         const result = await response.json();
        //         // console.log("from fE" , result.rowAppointmentID)
        //         setRowID(result.rowAppointmentID)
                
        //         console.log(result);
        //         const stateInfo = {
        //             appointmentDate : appointment.bookAppointment.date ,
        //             doctorName: appointment.doctorName ,
        //             doctorUsername: appointment.doctorUsername,
        //             appointmentPrice : hourlyRate ,
        //             appointmentSlot :appointment.bookAppointment.appointment,
        //             patient_username : username ,
        //             rowID : result.rowAppointmentID
        //           }
                    
        //         navigate('/patient/appointmentPayment', { state: stateInfo });
        
        //         // console.log("State Info", stateInfo)
                
        //     } else {
        //         const errorData = await response.json();
        //         console.error('Error:', errorData.message);
        //     }
        // } catch (error) {
        //     console.error('Network error:', error.message);
        // }
    } 

    const submitUnlinkedFamilyMemberAppointment = async () => {
        const selectedMember = unlinkedfamilyMembers.find((member) => member._id === familyMember);

        let fmNationalID, fmName;
        if (selectedMember) {
            fmNationalID = selectedMember.national_id;
            fmName = selectedMember.name;
        }

        const appointmentData = {
            doctor_username: appointment.doctorUsername ,
            doctorName: appointment.doctorName ,
            patient_username: fmNationalID,
            date: appointment.bookAppointment.date,
            time: appointment.bookAppointment.appointment,
            name: fmName,
            price: hourlyRate,
            booked_by: username,
            priceBefore : priceBefore,
            discount : discount
        };

        navigate('/patient/appointmentPayment', { state: appointmentData });

        // console.log(appointmentData)
        // try {
        //     const response = await fetch('http://localhost:5000/patient/appointment/createAppointment', {
        //         method: 'POST',
        //         headers: {
        //             'Content-Type': 'application/json',
        //         },
        //         body: JSON.stringify(appointmentData),
        //     });

        //     if (response.ok) {
        //         const result = await response.json();
        //         console.log("from fE" , result.rowAppointmentID)
        //         setRowID(result.rowAppointmentID)
        //         console.log(result);
        //         const stateInfo = {
        //             appointmentDate : appointment.bookAppointment.date ,
        //             doctorName: appointment.doctorName ,
        //             doctorUsername: appointment.doctorUsername,
        //             appointmentPrice : hourlyRate ,
        //             appointmentSlot :appointment.bookAppointment.appointment,
        //             patient_username : username ,
        //             rowID : result.rowAppointmentID
        //           }
                    
        //         navigate('/patient/appointmentPayment', { state: stateInfo });
        
        //         // console.log("State Info", stateInfo)
        //     } else {
        //         const errorData = await response.json();
        //         console.error('Error:', errorData.message);
        //     }
        // } catch (error) {
        //     console.error('Network error:', error.message);
        // }
    } 

    const submitLinkedFamilyMemberAppointment = async () => {
        const selectedMember = linkedfamilyMembers.find((member) => member._id === familyMember);

        console.log("submitLLLLinkedFamilyMemberAppointment", selectedMember);

        let linkedfmUsername, linkedfmName;
        if (selectedMember) {
            linkedfmUsername = selectedMember.username;
            linkedfmName = selectedMember.name;
        }

        const appointmentData = {
            doctor_username: appointment.doctorUsername ,
            doctorName: appointment.doctorName ,
            patient_username: linkedfmUsername,
            date: appointment.bookAppointment.date,
            time: appointment.bookAppointment.appointment,
            name: linkedfmName,
            price: hourlyRate,
            booked_by: username,
            priceBefore : priceBefore,
            discount : discount
        };

        navigate('/patient/appointmentPayment', { state: appointmentData });

        // console.log(appointmentData)
        // try {
        //     const response = await fetch('http://localhost:5000/patient/appointment/createAppointment', {
        //         method: 'POST',
        //         headers: {
        //             'Content-Type': 'application/json',
        //         },
        //         body: JSON.stringify(appointmentData),
        //     });

        //     if (response.ok) {
        //         const result = await response.json();
        //         // console.log("from fE" , result.rowAppointmentID)
        //         setRowID(result.rowAppointmentID)
        //         // console.log(result);
        //         const stateInfo = {
        //             appointmentDate : appointment.bookAppointment.date ,
        //             doctorName: appointment.doctorName ,
        //             doctorUsername: appointment.doctorUsername,
        //             appointmentPrice : hourlyRate ,
        //             appointmentSlot :appointment.bookAppointment.appointment,
        //             patient_username : username ,
        //             rowID : result.rowAppointmentID
        //           }
                    
        //         navigate('/patient/appointmentPayment', { state: stateInfo });
        
        //         console.log("State Info", stateInfo)
        //     } else {
        //         const errorData = await response.json();
        //         console.error('Error:', errorData.message);
        //     }
        // } catch (error) {
        //     console.error('Network error:', error.message);
        // }
    }

    const handleSubmit = () => {
        if (selectedOption === 'self') {
            submitAppointment();
            // console.log('Appointment Details for Self:', appointment);
            // window.alert('Appointment successfully added!');
        } else if (selectedOption === 'family') {
            // Check if a family member is selected
            if (familyMember) {
                // Find the selected family member in the allFamilyMembers list
                const selectedFamilyMember = allFamilyMembers.find(member => member._id === familyMember);
    
                // Check the type of the selected family member
                if (selectedFamilyMember) {
                    if (selectedFamilyMember.type === 'linked') {
                       submitLinkedFamilyMemberAppointment();
                    } else if (selectedFamilyMember.type === 'unlinked') {
                        submitUnlinkedFamilyMemberAppointment();
                    }
                } else {
                    // Handle the case where the selected family member is not found
                    console.error('Selected family member not found in the allFamilyMembers list.');
                }
            } else {
                // Handle the case where no family member is selected
                console.error('No family member selected.');
            }
        }
    };
    

    const [familyMember,setFamilyMember]= useState('');

     const allFamilyMembers = [
        ...unlinkedfamilyMembers.map((member) => ({ ...member, type: 'unlinked' })),
        ...linkedfamilyMembers.map((member) => ({ ...member, type: 'linked' })),
    ];

    console.log("fam", allFamilyMembers)

    //Authenticate
    if (load) {
        return (<div>Loading</div>)
    }

    return (
        <div>
            <div className={styles['header-container']}>
                <Button className={styles['back-button']} onClick={() => navigate(-1)}>
                    <FontAwesomeIcon icon={faArrowLeft} />
                </Button>
                <h1>Book Appointment</h1>
            </div>


            <div className={styles['appointment-patient-container']}>
                <div className={styles['h2-book']}>
                    <span className={styles['label']}>Doctor Name:</span>
                    <h4>{appointment.doctorName}</h4>
                </div>

                <div className={styles['h2-book']}>
                    <span className={styles['label']}>Appointment Date :</span>
                    <h4>{appointment.bookAppointment.weekday}, {appointment.bookAppointment.date}</h4>
                </div>

                <div className={styles['h2-book']}>
                    <span className={styles['label']}>Appointment Time :</span>
                    <h4>{appointment.bookAppointment.combinedTime}</h4>
                </div>

                <div className={styles['h2-book']}>
                    <h2 >Book For :
                        
                        <select style={{ marginLeft: '180px' }}
                            value={selectedOption}
                            onChange={(event) => {
                                handlePatientAppointmentChange(event.target.value);
                            }}
                        >
                            <option value="">Select</option>
                            <option value="self">Myself</option>
                            <option value="family">Family Member</option>
                        </select> </h2>
                </div>


                {selectedOption === 'family' && (
                    <div>
                        <h2 className={styles['h2-book']} >
                            Select Family Member:
                            <select style={{ marginLeft: '20px' }}
                                value={familyMember}
                                onChange={(event) => {
                                    handleUpdatedFamily(event);
                                    //getHourlyRateByUsername(selectedUnlinkedFamilyMember, appointment.doctorUsername);
                                }}
                            >
                                <option value="">Select a family member</option>
                                {allFamilyMembers.map((member) => (
                                    <option key={member._id} value={member._id} >
                                        {member.name}
                                    </option>
                                ))}
                            </select>
                        </h2>
                    </div>
                )}
            

                <div className={styles['h2-book']}>
                    <span className={styles['label']}>Hourly Rate :</span>
                    <h4>{hourlyRate} LE</h4>
                </div>
                <br></br>
                <button className={styles['button-2']} onClick={handleSubmit}>
                    Book
                </button>
            </div>
        </div>
    );
};

export default BookAppointmentForm;