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
    const [response] = useFetch('get', 'http://localhost:5000/doctor/patients', {doctor_username:"mohameds0liman"}); // To store the response of the request
    const [patients, setPatients] = useState([]); // To store the patients that will be displayed in cards
    const [patientInfo, setPatientInfo] = useState(""); // To store the patient that was clicked

    const navigate = useNavigate(); // To redirect to another page

    useEffect(() => {
        if (patientInfo !== "") {
            navigate('/doctor/viewPatientInfoPage', { state: patientInfo });
        }
    },[patientInfo]);

    useEffect(() => {
        const list = [];

        if(response !== undefined && response.patients !== undefined) {
            for (let i = 0; i < response.patients.length; i++) {
                list.push(response.patients[i]);
            }

            setPatients(list);
        }

    }, [response]);
    
    // Functions
    function handleSearch(name) {
        const list = [];

        if (response !== undefined && response.patients !== undefined) {
            for (let i = 0; i < response.patients.length; i++) {
                let name1 = name.toUpperCase();
                let name2 = response.patients[i].name.toUpperCase();
    
                if (name2.indexOf(name1) === 0) {
                    list.push(response.patients[i]);
                }
            }
    
            setPatients(list);
        }
    }

    function handleFilterClick() {
        // Search over each patient and check whether any of his appointments is greater than the current appointment
        // If yes, then add him to the list
        // If no, then don't add him to the list
        const list = [];
        const date = new Date();
        
        if (response !== undefined && response.patients !== undefined) {
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

    }

    function handleDatePickerClick(date) {
        // Search over each patient and check whether any of his appointments is greater than the current appointment
        // If yes, then add him to the list
        // If no, then don't add him to the list
        const list = [];

        if (response !== undefined && response.patients !== undefined) {
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
    }

    function handleCardClick(patient_username) {
        // Set the detailed patient to the patient that was clicked
        // Redirect to the patient's page
        if (response !== undefined && response.patients !== undefined) {
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
    }

    function handleClearSearchFilter() {
        // Clear the search bar
        // Clear the filter
        // Clear the date picker
        // Set the patients to the original list
        if (response !== undefined && response.patients !== undefined) {
            setPatients(response.patients);
        }
    }
    
    return (
        <div className={styles['page-body-div']}>
            <div className={styles['page-search-div']}>
                <SearchBar handleSearch={handleSearch} handleFilterClick={handleFilterClick} handleDatePickerClick={handleDatePickerClick} handleClearSearchFilter={handleClearSearchFilter}/>
            </div>
            <div className={styles['page-cards-div']}>
                {
                    patients && patients.map((patient, index) => {
                        return <PatientCard key={index} patient={patient} handleCardClick={handleCardClick} />
                    })
                }
            </div>
        </div>
    );
};