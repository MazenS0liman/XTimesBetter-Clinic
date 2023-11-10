import React from 'react';

// Axios
import axios from 'axios';

// Styles
import styles from './viewDoctorMainPage.module.css'

// React Router Dom Components
import { Routes, Route, Navigate } from 'react-router-dom';

// React Router Dom Hooks
import { useNavigate } from 'react-router-dom';

// Hooks
import { useAuth } from '../../../components/hooks/useAuth';

// Pages
import { ViewPatientInfo } from '../viewPatientInfoPage/viewPatientInfoPage';
import { ViewPatients } from '../viewPatientsPage/viewPatientsPage';
import UpdateDoctorInfo from '../doctorInfoPage/updateDoctorInfo';
import AppointmentsByStatusViewDoctor from '../FilterAppointmentsForDoctorByStatus/FilterAppointmentsForDoctorByStatus';
import AppointmentsByDateViewDoctor from '../viewFilterAppointmentsForDoctorByDate/FilterAppointmentsForDoctorByDate';
import { DoctorProfile } from '../DoctorProfile/DoctorProfile';
import ContractView from '../viewContractPage/ViewContract';
import ViewWalletPage from '../viewWalletPage/viewDoctorWalletPage';


// Components
import { Navbar } from '../../../components/navBar/navBar';


export const ViewDoctorMainPage = () => {
    // const {accessToken, refreshToken} = useAuth();
    const accessToken = sessionStorage.getItem("accessToken");
    const navigate = useNavigate();
    console.log("Doctor Access Token: ", accessToken);

    async function checkAuthentication() {
        await axios ({
            method: 'get',
            url: `http://localhost:5000/authentication/checkAccessToken`,
            headers: {
                "Content-Type": "application/json",
                'Authorization': accessToken,
                'User-type': 'doctor',
            },
        })
        .then((response) => {
            console.log(response);
        })
        .catch((error) => {
          navigate('/login');
        });
    }

    checkAuthentication();

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
        },
        {
            url: "/doctor/viewContract",
            pageName: "Contract Info",
        },
        {
            url: "/doctor/viewWalletNumber",
            pageName: "View Wallet",
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
                    <Route path="/viewContract" element={<ContractView />} />
                    <Route path="/viewWalletNumber" element={<ViewWalletPage />} />

                </Routes>
            </>
        </div>
    )
}