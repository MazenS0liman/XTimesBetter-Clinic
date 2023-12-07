import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './patientVisitLogPage.module.css';

import backgroundImage from '../../../assets/img/patientLogBackground.jpg'

import { redirect, useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
const PatientVisitLog = () => {
    const navigate = useNavigate();

    //authentication part
    const accessToken = sessionStorage.getItem('accessToken');
    const [load, setLoad] = useState(true);
    const [username, setUsername] = useState('');
    console.log(accessToken);
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

            })
            .catch((error) => {
                navigate('/login');

            });
    }

    checkAuthentication();


    const [myPatients, setMyPatients] = useState([]);
    useEffect(() => {

        const fetchAllMyPatients = async () => {
            try {
                const response = await axios.get('http://localhost:5000/doctor/newPrescription/myPatients', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': accessToken,
                    },
                });
                if (response && response.data) {
                    setMyPatients(response.data);
                }
            } catch (error) {
                throw new Error('Invalid response data');
            }
        };

        fetchAllMyPatients();
    }, []);

    const myPatientsList = myPatients;

    const redirectToWritePrescription = async (patientUsername, date, visitID, patientName) => {
        sessionStorage.removeItem('prescriptionMeds');
        navigate('/doctor/addMedsToPrescription', { state: { patientUsername: patientUsername, patientName: patientName, visitDate: date, visitID: visitID } })

    };

    if (load) {
        return (<div>Loading</div>)
    }
    return (
        <div className={styles["patientVisitLogContainer"]} style={{ backgroundImage: `url(${backgroundImage})` }}>
            <h1 className={styles["patientLogTitle"]}>Patients Log</h1>
            <div className={styles["patientLogContainer"]}>
                <table className={styles["patientLogTable"]}>
                    <thead>
                        <tr className={styles["patientLogTableHeader"]}>
                            {/* <th>Appointment ID</th> */}
                            <th>Patient Name</th>
                            <th>Appointment Date</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody className={styles["patientLogTableCell"]}>
                        {
                            myPatientsList && myPatientsList.map((record) => (
                                <tr key={record.patient_username}>
                                    {/* <td className={styles["patientLogTableCell"]}>{record._id}</td> */}
                                    <td className={styles["patientLogTableCell"]}>{record.name}</td>
                                    <td className={styles["patientLogTableCell"]}>{record.date}</td>
                                    <td className={styles["addPrescriptionCell"]}><button className={styles["addPrescriptionButton"]} onClick={() => redirectToWritePrescription(record.patient_username, record.date, record._id, record.name)}>Add Prescription</button></td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div >

        </div>
    );
};

export default PatientVisitLog;