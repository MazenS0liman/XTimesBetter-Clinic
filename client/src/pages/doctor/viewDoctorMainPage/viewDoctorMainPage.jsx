import React from 'react';

// Styles
import styles from './viewDoctorMainPage.module.css'

// React Router Dom Components
import { Routes, Route, Navigate } from 'react-router-dom';

// Hooks
import { useAuth } from '../../../components/hooks/useAuth';

// Pages
import { ViewPatientInfo } from '../viewPatientInfoPage/viewPatientInfoPage';
import { ViewPatients } from '../viewPatientsPage/viewPatientsPage';
import UpdateDoctorInfo from '../doctorInfoPage/updateDoctorInfo';
import AppointmentsByStatusViewDoctor from '../FilterAppointmentsForDoctorByStatus/FilterAppointmentsForDoctorByStatus';
import AppointmentsByDateViewDoctor from '../viewFilterAppointmentsForDoctorByDate/FilterAppointmentsForDoctorByDate';
import { DoctorProfile } from '../DoctorProfile/DoctorProfile';

// Components
import { Navbar } from '../../../components/navBar/navBar';

export const ViewDoctorMainPage = () => {
    const {accessToken, refreshToken} = useAuth();
    console.log("Doctor Access Token: ", accessToken);

    const list = [
        {
            url: "/doctor/profile",
            pageName: "Profile",
        },
        {
            url: "/doctor/viewPatientsPage",
            pageName: "Patients",
        },
        {
            url: "/doctor/updateInfoPage",
            pageName: "Update Info",
        },
        {
            url: "/doctor/FilterAppointmentByStatusDoctor",
            pageName: "Filter Status",
        },
        {
            url: "/doctor/FilterAppointmentByDateDoctor",
            pageName: "Filter Date",
        }
    ];

    if (accessToken.split(' ')[1] === "") return (<Navigate to="/login" />);

    return (
        <div className={styles['main-div']}>
            <Navbar name="Doctor" list={list} />
            <>
                <Routes>
                    <Route path='/viewPatientsPage' element={<ViewPatients />} />
                    <Route path='/viewPatientInfoPage' element={<ViewPatientInfo />} ></Route>
                    <Route path="/updateInfoPage" element={<UpdateDoctorInfo />} ></Route>
                    <Route path="/FilterAppointmentByStatusDoctor" element={<AppointmentsByStatusViewDoctor />} />
                    <Route path="/FilterAppointmentByDateDoctor" element={<AppointmentsByDateViewDoctor />} />
                    <Route path="/profile" element={<DoctorProfile />} />
                </Routes>
            </>
        </div>
    )
}