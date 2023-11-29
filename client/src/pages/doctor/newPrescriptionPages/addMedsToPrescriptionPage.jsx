import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './addMedsToPrescriptionPage.module.css';

import { redirect, useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
const AddMedsToPrescription = () => {
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
    const location = useLocation();
    useEffect(() => {
        if (location.state && location.state.visitDate && location.state.patientUsername && location.state.visitID) {
            setVisitDate(location.state.visitDate);
            SetPatientUsername(location.state.patientUsername);
            setVisitID(location.state.visitID);

        }
    }, [location.state]);

    const [medicines, setMedicines] = useState([]);
    const [prescriptionMeds, setPrescriptionMeds] = useState([]);
    const [doseValues, setDoseValues] = useState({});
    const [notesValues, setNotesValues] = useState({});


    useEffect(() => {

        const fetchAllMedicines = async () => {
            try {
                const response = await axios.get('http://localhost:5000/doctor/newPrescription/medicines', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': accessToken,
                    },
                });
                if (response && response.data) {
                    setMedicines(response.data);
                }
            } catch (error) {
                throw new Error('Invalid response data');
            }
        };

        fetchAllMedicines();
    }, []);

    const handleNotesChange = (medicineName, newNotes) => {
        setNotesValues({ ...notesValues, [medicineName]: newNotes });
    };

    const handleDoseChange = (medicineName, action) => {
        const currentDose = doseValues[medicineName] || 1;
        const updatedDose = action === 'increment' ? currentDose + 1 : Math.max(1, currentDose - 1);
        setDoseValues({ ...doseValues, [medicineName]: updatedDose });
    };

    const addToPrescription = async (medicineName, dose, notes, price, prescriptionMeds) => {

        try {
            //const prescriptionMeds = JSON.parse(sessionStorage.getItem('prescriptionMeds')) || [];
            const response = await axios.post('http://localhost:5000/doctor/newPrescription/addMed', {
                medName: medicineName,
                dose,
                notes,
                price,
                prescriptionMeds: prescriptionMeds, // Pass the current prescriptionMeds
            });

            if (response.data.success) {
                setPrescriptionMeds(response.data.prescriptionMeds);
                console.log("Medicine added successfully!");
                //sessionStorage.setItem('prescriptionMeds', JSON.stringify(response.data.prescriptionMeds));

            } else {
                alert("Medicine already prescribed!");
            }
        } catch (error) {
            //console.error("Error adding medicine to prescription:", error);
            alert("Medicine already prescribed!");

        }
    };
    const redirectToFinalizePrescription = async () => {

        sessionStorage.setItem('prescriptionMeds', JSON.stringify(prescriptionMeds));
        navigate('/doctor/finalizePrescription', { state: { prescriptionMeds: prescriptionMeds, visitDate: visitDate, visitID: visitID, patientUsername: patientUsername } })

    };

    if (load) {
        return (<div>Loading</div>)
    }
    return (
        <>
            <h1>Medicine List</h1>
            <div className={styles["detailsContainer"]}>
                <h1 className={styles["addMedsHeading"]}>Patient: {patientUsername}</h1>
                <h1 className={styles["addMedsHeading"]}>Visit Date: {visitDate}</h1>
                <button className={styles["redirectButton"]} onClick={() => redirectToFinalizePrescription()}>Review Prescription</button>
            </div>
            <div className={styles["addMedsContainer"]}>
                <table className={styles["medsTable"]}>
                    <thead className={styles["tableHeader"]}>
                        <tr>
                            <th>Image</th>
                            <th>Name</th>
                            <th>Active Ingredients</th>
                            <th>Medicinal Uses</th>
                            <th>Dose</th>
                            <th>Note</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            medicines && medicines.map((medicine) => (
                                <tr key={medicine.name}>
                                    <td className={styles["tableCell"]}><img src={medicine.image} alt="Medicine Image" style={{ width: '150px', height: 'auto' }} /></td>
                                    <td className={styles["tableCell"]}>{medicine.name}</td>
                                    <td className={styles["tableCell"]}>{medicine.activeIngredients.map((ingredient, index) => (
                                        <li key={index}>{ingredient}</li>
                                    ))}</td>
                                    <td className={styles["tableCell"]}>{medicine.medicinalUses.map((use, index) => (
                                        <li key={index}>{use}</li>
                                    ))}</td>
                                    <td className={styles["tableCell"]}>
                                        <div>
                                            <button
                                                onClick={() => handleDoseChange(medicine.name, 'decrement')}
                                                disabled={prescriptionMeds.some((med) => med.name === medicine.name)}
                                            >-</button>
                                            <span>{doseValues[medicine.name] || 1}</span>
                                            <button
                                                onClick={() => handleDoseChange(medicine.name, 'increment')}
                                                disabled={prescriptionMeds.some((med) => med.name === medicine.name)}
                                            >+</button>

                                        </div>
                                    </td>
                                    <td className={styles["tableCell"]}>
                                        <input className={styles["notesInput"]}
                                            type="text"
                                            placeholder="Enter notes"
                                            value={notesValues[medicine.name] || ''}
                                            onChange={(e) => handleNotesChange(medicine.name, e.target.value)}
                                            disabled={prescriptionMeds.some((med) => med.name === medicine.name)}
                                        />
                                    </td>
                                    <td className={styles["tableCell"]}>
                                        {!medicine.availableQuantity ? <span className={styles["outOfStock"]}>Out of Stock</span> : (<button className={styles["addButton"]} onClick={() =>
                                            addToPrescription(
                                                medicine.name,
                                                doseValues[medicine.name] || 1,
                                                notesValues[medicine.name] || '',
                                                medicine.price || 0,
                                                prescriptionMeds)}
                                            disabled={prescriptionMeds.some((med) => med.name === medicine.name)}>Add</button>)}
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>


        </>
    );
};

export default AddMedsToPrescription;