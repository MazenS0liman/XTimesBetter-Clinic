import React from 'react';

// Styles
import styles from './viewPatientMainPage.module.css'

// React Router Dom Components
import { Routes, Route, Navigate } from 'react-router-dom';

// Pages
import PatientRegister from '../viewRegisterationPage/patientRegisterPage';
import  ViewAllDrs  from '../ViewAllDrs/ViewAllDrs';
import  ViewDoctorsList  from'../ViewDoctorListPage/ViewDoctorListPage'
import  ViewDoctorInfo  from '../ViewDoctorInfoPage/ViewDoctorInfoPage';


// Components
import { Navbar } from '../../../components/navBar/navBar';

export const ViewPatientMainPage = () => {
    const list = [
        {
            url: "/patient/patientRegister",
            pageName: "Registeration",
        },
        {
            url: "/patient/ViewAllDrs",
            pageName: "Doctors",
        },
        {
            url: "/patient/viewDoctorsListPage",
            pageName: "Doctors List",
        },
        
        
        
    ];

    return (
        <div className={styles['main-div']}>
            <Navbar name="Patient" list={list} />
            <>
            <Routes>
                <Route path="/patientRegister" element={<PatientRegister />} />
                <Route path='/ViewAllDrs' element={<ViewAllDrs />}/>
                <Route path='/viewDoctorsListPage' element={< ViewDoctorsList />}/>
                <Route path='/viewDoctorInfoPage' element={< ViewDoctorInfo />} ></Route>
        
            </Routes>
            </>
        </div>
    )
}