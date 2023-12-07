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
    const [patientName, setPatientName] = useState('');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('');
    const location = useLocation();
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/doctor/newPrescription/getInfo/${location.state.patientUsername}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': accessToken,
                    },
                });

                if (response && response.data) {
                    const { age, gender } = response.data;
                    setAge(age);
                    setGender(gender);
                }
            } catch (error) {
                console.error('Error fetching patient information:', error);
            }
        };

        if (location.state && location.state.visitDate && location.state.patientUsername && location.state.visitID && location.state.patientName) {
            setVisitDate(location.state.visitDate);
            SetPatientUsername(location.state.patientUsername);
            setVisitID(location.state.visitID);
            setPatientName(location.state.patientName);
            fetchData(); // Fetch additional information when the component mounts
        }
    }, [location.state, accessToken]);

    const [medicines, setMedicines] = useState([]);
    const prescriptionMedsFromSessionStorage = JSON.parse(sessionStorage.getItem('prescriptionMeds')) || [];
    const [prescriptionMeds, setPrescriptionMeds] = useState(prescriptionMedsFromSessionStorage);

    // Extract dosage from prescriptionMeds or use empty objects as default


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

    const addToPrescription = async (medicineName, price, prescriptionMeds) => {

        try {
            //const prescriptionMeds = JSON.parse(sessionStorage.getItem('prescriptionMeds')) || [];
            const response = await axios.post('http://localhost:5000/doctor/newPrescription/addMed', {
                medName: medicineName,
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

    const removeFromPrescription = (medicineName) => {
        const updatedPrescriptionMeds = prescriptionMeds.filter((med) => med.name !== medicineName);
        setPrescriptionMeds(updatedPrescriptionMeds);
    };

    const redirectToFinalizePrescription = async () => {

        sessionStorage.setItem('prescriptionMeds', JSON.stringify(prescriptionMeds));
        navigate('/doctor/finalizePrescription', { state: { prescriptionMeds: prescriptionMeds, visitDate: visitDate, visitID: visitID, patientUsername: patientUsername, patientName: patientName, gender: gender, age: age } })

    };

    const redirectToPatientsLog = async () => {
        sessionStorage.removeItem('prescriptionMeds');
        navigate('/doctor/writePrescription');

    }



    if (load) {
        return (<div>Loading</div>)
    }
    return (
        <>
            <div className={styles["detailsContainer"]}>
                <div className={styles["patientDetails"]}>
                    <h2 className={styles["patientName"]}>Patient Info</h2>
                    <div className={styles["patientInfo"]}>
                        <p className={styles["label"]}>Name:</p>
                        <p className={styles["patientValue"]}>{patientName}</p>
                        <p className={styles["label"]}>Age:</p>
                        <p className={styles["patientValue"]}>{age}</p>
                        <p className={styles["label"]}>Gender:</p>
                        <p className={styles["patientValue"]}>{gender}</p>
                        <p className={styles["label"]}>Appointment Date:</p>
                        <p className={styles["patientValue"]}>{visitDate}</p>
                    </div>
                </div>
            </div>
            <div className={styles["buttonContainer"]}>
                <button className={styles["cancelButton"]} onClick={() => redirectToPatientsLog()}>Cancel Prescription</button>
                <button className={styles["reviewButton"]} onClick={() => redirectToFinalizePrescription()}>Review Prescription</button>
            </div>
            <div className={styles["addMedsContainer"]}>
                <table className={styles["medsTable"]}>
                    <thead className={styles["tableHeader"]}>
                        <tr>
                            <th></th>
                            <th>Medicine Name</th>
                            <th>Active Ingredients</th>
                            <th>Medicinal Uses</th>
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
                                        {!medicine.availableQuantity ? (
                                            <span className={styles["outOfStock"]}>Out of Stock</span>
                                        ) : (
                                            <>
                                                <button
                                                    className={styles["addButton"]}
                                                    onClick={() => addToPrescription(medicine.name, medicine.price || 0, prescriptionMeds)}
                                                    disabled={prescriptionMeds.some((med) => med.name === medicine.name)}
                                                >
                                                    Add
                                                </button>
                                                <button
                                                    className={styles["removeButton"]}
                                                    onClick={() => removeFromPrescription(medicine.name)}
                                                    disabled={!prescriptionMeds.some((med) => med.name === medicine.name)}
                                                >
                                                    Remove
                                                </button>
                                            </>
                                        )}
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