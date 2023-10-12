import React from 'react';

// Styles
import styles from './viewDoctorMainPage.module.css'

// React Router Dom Components
import { Routes, Route, Navigate } from 'react-router-dom';

// Pages
import { ViewPatientInfo } from '../viewPatientInfoPage/viewPatientInfoPage';
import { ViewPatients } from '../viewPatientsPage/viewPatientsPage';
import DoctorRequest from '../viewDoctorRequestPage/doctorRequestPage';
import UpdateDoctorInfo from'../doctorInfoPage/updateDoctorInfo';

// Components
import { Navbar } from '../../../components/navBar/navBar';

export const ViewDoctorMainPage = () => {
    const list = [
        {
            url: "/doctor/doctorRequest",
            pageName: "Registeration",
        },
        {
            url: "/doctor/viewPatientsPage",
            pageName: "Patients",
        },
        {
            url: "/doctor/updateInfoPage",
            pageName: "Update Info",
        },
        
    ];

    return (
        <div className={styles['main-div']}>
            <Navbar name="Doctor" list={list} />
            <>
            <Routes>
                <Route path='/viewPatientsPage' element={<ViewPatients />}/>
                <Route path='/viewPatientInfoPage' element={<ViewPatientInfo />} ></Route>
                <Route path="/doctorRequest" element={<DoctorRequest />} />
                <Route path = "/updateInfoPage" element = {<UpdateDoctorInfo/>} ></Route>
            </Routes>
            </>
        </div>
    )
}