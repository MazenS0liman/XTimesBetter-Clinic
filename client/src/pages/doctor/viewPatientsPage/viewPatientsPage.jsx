import React, { useEffect } from 'react';

// Styles
import styles from './viewPatientsPage.module.css';

// Components
import { PatientCard } from '../../../components/patientCard/patientCard';
import { SearchBar } from '../../../components/searchBar/searchBar';
import { useNavigate } from 'react-router-dom';

// Hooks
import { useFetch } from '../../../components/hooks/useFetch';
import { useState } from 'react';

export const ViewPatients = () => {
    const [response] = useFetch('get', 'http://localhost:5000/doctor/patients', {doctor_username:"mohameds0liman"});
    const [patients, setPatients] = useState(response.patients);
    const [patientInfo, setPatientInfo] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        if (patientInfo !== "") {
            navigate('/doctor/viewPatientInfoPage', { state: patientInfo });
        }
    },[patientInfo]);
    
    // Functions
    function handleSearch(name) {
        const list = [];

        for (let i = 0; i < response.patients.length; i++) {
            if (response.patients[i].name.includes(name)) {
                list.push(response.patients[i]);
            }
        }

        setPatients(list);
    }

    function handleFilterClick() {
        // Search over each patient and check whether any of his appointments is greater than the current appointment
        // If yes, then add him to the list
        // If no, then don't add him to the list
        const list = [];
        const date = new Date();
        
        for (let i = 0; i < response.patients.length; i++) {
            for (let j = 0; j < response.patients[i].appointments.length; j++) {
                let appointmentDate = new Date(response.patients[i].appointments[j].date);

                if (appointmentDate >= date) {
                    list.push(response.patients[i]);
                    break;
                }
            }
        }
        setPatients(list);
    }

    function handleCardClick(patient_username) {
        // Set the detailed patient to the patient that was clicked
        // Redirect to the patient's page
        let patient = null;
        for (let i = 0; i < response.patients.length; i++) {
            if (response.patients[i].username === patient_username) {
                patient = response.patients[i];
                break;
            }
        }
        
        if (patient !== null) {
            setPatientInfo(patient);
        }
    }
    return (
        <div className={styles['page-body-div']}>
            <div className={styles['page-search-div']}>
                <SearchBar handleSearch={handleSearch} handleFilterClick={handleFilterClick} />
            </div>
            <div className={styles['page-cards-div']}>
                {
                    patients && patients.map((patient, index) => {
                        return <PatientCard key={index} patient={patient} handleCardClick={handleCardClick}/>
                    })
                }
            </div>
        </div>
    );
};
