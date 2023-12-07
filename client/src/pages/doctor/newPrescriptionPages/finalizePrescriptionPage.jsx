import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './finalizePrescriptionPage.module.css';

import { redirect, useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
const FinalizePrescription = () => {
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

    const [visitDate, setVisitDate] = useState('');
    const [patientUsername, SetPatientUsername] = useState('');
    const [patientName, SetPatientName] = useState('');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('');
    const [visitID, setVisitID] = useState('');
    const [prescriptionMeds, setPrescriptionMeds] = useState([]);

    const [dosage, setdosage] = useState({});
    const location = useLocation();
    useEffect(() => {
        const storedPrescriptionMeds = JSON.parse(sessionStorage.getItem('prescriptionMeds')) || [];
        const initialPrescription = storedPrescriptionMeds || [];
        setPrescriptionMeds(initialPrescription);
        const initialDosage = {};
        initialPrescription.forEach(medicine => {
            initialDosage[medicine.name] = medicine.dosage || '';
        });
        setdosage(initialDosage);

        if (location.state) {
            setVisitDate(location.state.visitDate);
            SetPatientUsername(location.state.patientUsername);
            setVisitID(location.state.visitID);
            SetPatientName(location.state.patientName);
            setAge(location.state.age);
            setGender(location.state.gender);
        }


    }, [location.state]);


    const updatePrescriptionMeds = (type, medicineName, value) => {
        const storedPrescriptionMeds = JSON.parse(sessionStorage.getItem('prescriptionMeds')) || [];
        const updatedPrescriptionMeds = storedPrescriptionMeds.map(medicine => {
            if (medicine.name === medicineName) {
                if (type === 'dosage') {
                    return { ...medicine, dosage: value };
                }
            }
            return medicine;
        });
        sessionStorage.setItem('prescriptionMeds', JSON.stringify(updatedPrescriptionMeds));
    };

    const handleDosageChange = (medicineName, newDosage) => {
        // If the new dosage is an empty string, remove the medicine from the dosage state
        if (newDosage.trim() === '') {
            const { [medicineName]: _, ...updatedDosage } = dosage;
            setdosage(updatedDosage);
        } else {
            // Update the dosage state with the new value
            setdosage((prevDosage) => ({ ...prevDosage, [medicineName]: newDosage }));
        }

        // Update the prescriptionMeds in sessionStorage
        updatePrescriptionMeds('dosage', medicineName, newDosage);
    };


    const handleDelete = (medicineName) => {
        const updatedPrescriptionMeds = prescriptionMeds.filter(medicine => medicine.name !== medicineName); //remove from state
        setPrescriptionMeds(updatedPrescriptionMeds);
        sessionStorage.setItem('prescriptionMeds', JSON.stringify(updatedPrescriptionMeds)); //remove from session storage
    };

    const handleSubmit = async () => {
        const prescriptionMeds = JSON.parse(sessionStorage.getItem('prescriptionMeds'));
        if (!prescriptionMeds || prescriptionMeds.length === 0) {
            alert('Prescription is empty. Please add medicines before submitting.');
            return;
        }
        const isDosageEmpty = Object.values(dosage).some(d => d.trim() === '');
        //console.log("Dosage", dosage)
        if (isDosageEmpty) {
            alert('Please enter dosage for all medicines before submitting.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/doctor/newPrescription/saveNewPrescription', {
                patientUsername,
                visitDate,
                visitID,
                prescriptionMeds,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': accessToken,
                },

            }
            );
            console.log(response.data.message);
            alert("Saved successfully!");
            sessionStorage.removeItem('prescriptionMeds');
            navigate('/doctor/writePrescription');

        } catch (error) {
            console.error('Error saving prescription:', error.message);
        }
    };

    const redirectBack = () => {
        navigate('/doctor/addMedsToPrescription', {
            state: { visitDate: visitDate, visitID: visitID, patientUsername: patientUsername, patientName: patientName, gender: gender, age: age }
        });
    };

    if (load) {
        return (<div>Loading</div>)
    }
    return (
        <>

            <div className={styles["prescriptionHeader"]}>
                <div className={styles["prescriptionHeaderInfo"]}>
                    <h2>Prescription</h2>
                    <p>Issued On: {new Date().toLocaleDateString('en-GB')}</p>
                </div>
                <div className={styles["patientInfo"]}>
                    <p>Patient Name: {patientName}</p>
                    <p>Age: {age}</p>
                    <p>Gender: {gender}</p>
                    <p>Visit Date: {visitDate}</p>
                </div>
            </div>
            <div className={styles["finalizePrescriptionContainer"]}>
                <table className={styles["finalizePrescriptionTable"]}>
                    <thead>
                        <th>Medicine</th>
                        <th>Dosage</th>
                        <th></th>
                    </thead>
                    <tbody>
                        {
                            prescriptionMeds && prescriptionMeds.map((medicine) => (
                                <tr key={medicine.name}>
                                    <td>{medicine.name}</td>
                                    <td>
                                        <input
                                            type="text"
                                            placeholder="Enter Dosage"
                                            value={dosage[medicine.name] || ""}
                                            onChange={(e) => handleDosageChange(medicine.name, e.target.value)}
                                        />
                                    </td>
                                    <td className={styles["finalizePrescriptionDeleteCell"]}>
                                        <button className={styles["finalizePrescriptionDelete"]} onClick={() => handleDelete(medicine.name)}>Delete</button>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
            <div>
                <button className={styles["backButton"]} onClick={() => redirectBack()}>Back</button>
                <button className={styles["finalizePrescriptionSubmit"]} onClick={() => handleSubmit()}>Submit</button>
            </div>


        </>
    );
};

export default FinalizePrescription;