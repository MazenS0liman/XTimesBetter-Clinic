import React from 'react';

// Axios
import axios from 'axios';

// Styles
import styles from './viewPatientMainPage.module.css'

// React Router Dom Components
import { Routes, Route, Navigate } from 'react-router-dom';

// React Router Dom Hooks
import { useNavigate } from 'react-router-dom';

// User Defined Hooks
import { useAuth, useUsername } from '../../../components/hooks/useAuth'; 

// Pages
import ViewAllDrs from '../ViewAllDrs/ViewAllDrs';
import ViewDoctorsList from '../ViewDoctorListPage/ViewDoctorListPage'
import ViewDoctorInfo from '../ViewDoctorInfoPage/ViewDoctorInfoPage';
import PrescriptionTable from '../viewPrescriptionInfoPage/PrescriptionTable';
import FamilyView from '../PatientHome/PatientHome';
import AddFamilyMember from '../AddFamilyMember/AddFamilyMember';
import AppointmentsByStatusViewPatient from '../FilterAppointmentsForPatientByStatus/FilterAppointmentsForPatientByStatus';
import AppointmentsByDateViewPatient from '../FilterAppointmentsForPatientByDate/FilterAppointmentsForPatientByDate';
import { PatientProfile } from '../PatientProfile/PatientProfile';
import LinkPatientWithAnotherByEmail from '../LinkPatientWithAnother/LinkPatientWithAnotherByEmail';
import LinkPatientWithAnotherByMobile from '../LinkPatientWithAnother/LinkPatientWithAnotherByMobile';
import PackagesDetails from '../ViewPackagesDetails/ViewPackagesDetails';
import SubsDetails from '../UnsubscribePackage/UnsubscribePackage';
import Appointments from '../ViewAppointmentsPage/ViewAppointmentsPage'
import BookAppointment from '../BookingFormPage/BookingFormPage'
import AppointmentPayment from '../payments/appointmentPaymentPage'
import PackagePayment from '../payments/packagePaymentPage'
import {SuccessPayment, SuccessPackagePayment} from '../payments/successPaymentPage'
import UnsuccessPayment from '../payments/unsuccessfulPaymentPage'
import ViewMedicalHistory from '../viewMedicalHistory/viewMedicalHistory';


// Components
import { Navbar } from '../../../components/navBar/navBar';
import ViewPatientWalletPage from '../viewWallet/viewPatientWalletPage';


export const ViewPatientMainPage = () => {
    // const {accessToken, refreshToken} = useAuth();
    const accessToken = sessionStorage.getItem('accessToken');
    const navigate = useNavigate();    

    async function checkAuthentication() {
        await axios ({
            method: 'get',
            url: `http://localhost:5000/authentication/checkAccessToken`,
            headers: {
                "Content-Type": "application/json",
                'Authorization': accessToken,
                'User-type': 'patient',
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
            url: "/patient/profile",
            pageName: "Profile",
        }
        ,
        {
            url: "/patient/ViewAllDrs",
            pageName: "Doctors",
        },
        {
            url: "/patient/viewDoctorsListPage",
            pageName: "Doctors List",
        },
        {
            url: "/patient/prescriptionTable",
            pageName: "Prescription Page",
        },
        {
            url: "/patient/FamilyInformation",
            pageName: "Family Info",
        },
        {
            url: "/patient/AddFamily",
            pageName: "Add Family Member",
        },
        {
            url: "/patient/FilterAppointmentByStatusPatient",
            pageName: "Filter Status",
        },
        {
            url: "/patient/FilterAppointmentByDatePatient",
            pageName: "Filter Date",
        },
        {
            url: "/patient/LinkPatientWithAnotherByEmail",
            pageName: "Link Family Member By Email",
        },
        {
            url: "/patient/LinkPatientWithAnotherByMobile",
            pageName: "Link Member By PhoneNumber",
        },
        {
            url: "/patient/ViewPackagesDetails",
            pageName: "Packages Details",
        },
        {
            url: "/patient/ViewSubscribedPackages",
            pageName: "Subscription Details",
        },
        {
            url: "/patient/viewWalletNumber",
            pageName: "View My Wallet",
        },
        {
            url: "/patient/ViewAppointments",
            pageName: "Appointments"
        },
        {
            url: "/patient/viewMedicalHistory",
            pageName: "Medical History",
        }
    ];

    if (accessToken.split(' ')[1] === "") return (<Navigate to="/login" />);

    return (
        <div className={styles['main-div']}>
            <Navbar name="Patient" list={list} />
            <>
                <Routes>
                    <Route path='/ViewAllDrs' element={<ViewAllDrs />} />
                    <Route path='/viewDoctorsListPage' element={< ViewDoctorsList />} />
                    <Route path='/viewDoctorInfoPage' element={< ViewDoctorInfo />} ></Route>
                    <Route path="/prescriptionTable" element={<PrescriptionTable />} />
                    <Route path="/FamilyInformation" element={<FamilyView />} />
                    <Route path="/AddFamily" element={<AddFamilyMember />} />
                    <Route path="/FilterAppointmentByStatusPatient" element={<AppointmentsByStatusViewPatient />} />
                    <Route path="/FilterAppointmentByDatePatient" element={<AppointmentsByDateViewPatient />} />
                    <Route path="/profile" element={<PatientProfile />} />
                    <Route path="/LinkPatientWithAnotherByEmail" element={<LinkPatientWithAnotherByEmail />} />
                    <Route path="/LinkPatientWithAnotherByMobile" element={<LinkPatientWithAnotherByMobile />} />
                    <Route path='/ViewPackagesDetails' element={<PackagesDetails/>} />
                    <Route path='/ViewSubscribedPackages' element={<SubsDetails/>} />
                    <Route path="/viewWalletNumber" element={<ViewPatientWalletPage />} />
                    <Route path="/ViewAppointments" element={<Appointments/>} />
                    <Route path="/BookAppointment" element={<BookAppointment/>} /> 
                    <Route path="/appointmentPayment" element={<AppointmentPayment />} />
                    <Route path="/packagePayment" element={<PackagePayment />} />
                    <Route path="/successPayment" element={<SuccessPayment />} />
                    <Route path="/successPackagePay" element={<SuccessPackagePayment />} />
                    <Route path="/unsuccessPayment" element={<UnsuccessPayment />} />
                    <Route path="/viewMedicalHistory" element={<ViewMedicalHistory />} />
                </Routes>
            </>
        </div>
    )
}