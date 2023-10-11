import React from 'react';

// Styles
import styles from './viewPatientMainPage.module.css'

// React Router Dom Components
import { Routes, Route, Navigate } from 'react-router-dom';

// Pages
import PatientRegister from '../viewRegisterationPage/patientRegisterPage';

// Components
import { Navbar } from '../../../components/navBar/navBar';

export const ViewPatientMainPage = () => {
    const list = [
        {
            url: "/patient/patientRegister",
            pageName: "Registeration",
        },
    ];

    return (
        <div className={styles['main-div']}>
            <Navbar name="Patient" list={list} />
            <>
            <Routes>
                <Route path="/patientRegister" element={<PatientRegister />} />
            </Routes>
            </>
        </div>
    )
}