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
    const [visitID, setVisitID] = useState('');
    const [prescriptionMeds, setPrescriptionMeds] = useState([]);
    const location = useLocation();
    useEffect(() => {
        const storedPrescriptionMeds = JSON.parse(sessionStorage.getItem('prescriptionMeds'));
        const initialPrescription = storedPrescriptionMeds || [];
        setPrescriptionMeds(initialPrescription);

        if (location.state && location.state.visitDate && location.state.patientUsername && location.state.visitID && location.state.prescriptionMeds) {
            setVisitDate(location.state.visitDate);
            SetPatientUsername(location.state.patientUsername);
            setVisitID(location.state.visitID);
            //setPrescriptionMeds(location.state.prescriptionMeds);
        }
    }, [location.state]);

    //console.log('prescription: ', prescriptionMeds)
    const [doseValues, setDoseValues] = useState({});
    const [notesValues, setNotesValues] = useState({});

    const [editMode, setEditMode] = useState(false);

    const updatePrescriptionMeds = (type, medicineName, value) => {
        const storedPrescriptionMeds = JSON.parse(sessionStorage.getItem('prescriptionMeds')) || [];
        const updatedPrescriptionMeds = storedPrescriptionMeds.map(medicine => {
            if (medicine.name === medicineName) {
                if (type === 'dose') {
                    return { ...medicine, dose: value };
                } else if (type === 'notes') {
                    return { ...medicine, timing: value };
                }
            }
            return medicine;
        });
        sessionStorage.setItem('prescriptionMeds', JSON.stringify(updatedPrescriptionMeds));
    };

    const handleNotesChange = (medicineName, newNotes) => {
        if (editMode) {
            setNotesValues({ ...notesValues, [medicineName]: newNotes });
            const newNotesValues = { ...notesValues, [medicineName]: newNotes };
            setNotesValues(newNotesValues);
            updatePrescriptionMeds('notes', medicineName, newNotes);
        }
    };

    const handleDoseChange = (medicineName, action) => {
        if (editMode) {
            const currentDose = doseValues[medicineName] || 1;
            const updatedDose = action === 'increment' ? currentDose + 1 : Math.max(1, currentDose - 1);
            const newDoseValues = { ...doseValues, [medicineName]: updatedDose };
            setDoseValues(newDoseValues);
            updatePrescriptionMeds('dose', medicineName, updatedDose);
        }
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
        navigate('/doctor/addMedsToPrescription', { state: { visitDate: visitDate, visitID: visitID, patientUsername: patientUsername } });
    };

    if (load) {
        return (<div>Loading</div>)
    }
    return (
        <>

            <div className={styles["prescriptionReviewContainer"]}>
                <h1 className={styles["prescriptionReviewTitle"]}>Prescription Review</h1>
                <h1 className={styles["prescriptionReviewItem"]}>Patient Username: {patientUsername}</h1>
                <h1 className={styles["prescriptionReviewItem"]}>Visit Date: {visitDate}</h1>
            </div>
            <div className={styles["finalizePrescriptionContainer"]}>
                <div className={styles["finalizeButtonContainer"]}>
                    <button className={styles["backButton"]} onClick={() => redirectBack()}>Back</button>

                    <button className={styles["finalizePrescriptionEditConfirm"]} onClick={() => setEditMode((prevMode) => !prevMode)}>
                        {editMode ? "Confirm" : "Edit"}
                    </button>
                </div>
                <table className={styles["finalizePrescriptionTable"]}>
                    <thead>
                        <th>Medicine</th>
                        <th>Dose</th>
                        <th>Note</th>
                        <th></th>
                    </thead>
                    <tbody>
                        {
                            prescriptionMeds && prescriptionMeds.map((medicine) => (
                                <tr key={medicine.name}>
                                    <td>{medicine.name}</td>
                                    <td>
                                        {editMode ? (
                                            <div>
                                                <button onClick={() => handleDoseChange(medicine.name, 'decrement')}>-</button>
                                                <span>{doseValues[medicine.name] || medicine.dose}</span>
                                                <button onClick={() => handleDoseChange(medicine.name, 'increment')}>+</button>
                                            </div>
                                        ) : (
                                            <span>{doseValues[medicine.name] || medicine.dose}</span>
                                        )}
                                    </td>
                                    <td>
                                        {editMode ? (
                                            <input
                                                type="text"
                                                placeholder="Enter notes"
                                                value={notesValues[medicine.name] || medicine.timing}
                                                onChange={(e) => handleNotesChange(medicine.name, e.target.value)}
                                            />
                                        ) : (
                                            <span>{notesValues[medicine.name] || medicine.timing}</span>
                                        )}
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
                <button className={styles["finalizePrescriptionSubmit"]} onClick={() => handleSubmit()}>Submit</button>

            </div>


        </>
    );
};

export default FinalizePrescription;