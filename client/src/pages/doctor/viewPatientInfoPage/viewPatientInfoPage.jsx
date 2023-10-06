import React from 'react'

// Styles
import styles from './viewPatientInfoPage.module.css';

// Hooks
import { useLocation, useNavigate } from 'react-router-dom';

export function ViewPatientInfo() {
    const location = useLocation();
    const navigate = useNavigate();
    const patient = location.state;
    
    return (
        <>
            <div>{patient.username}</div>
            <div>{patient.email}</div>
            <div>{patient.name}</div>
            <div>{patient.appointments[0].date}</div>
            <button onClick={() => navigate(-1)}>Go back</button>
        </>
    )
}
