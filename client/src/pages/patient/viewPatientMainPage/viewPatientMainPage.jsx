import React from 'react';

// Styles
import styles from './viewPatientMainPage.module.css'

// React Router Dom Components
import { Routes, Route, Navigate } from 'react-router-dom';

// Pages
import PatientRegister from '../viewRegisterationPage/patientRegisterPage';
import ViewAllDrs from '../ViewAllDrs/ViewAllDrs';
import ViewDoctorsList from '../ViewDoctorListPage/ViewDoctorListPage'
import ViewDoctorInfo from '../ViewDoctorInfoPage/ViewDoctorInfoPage';
import PrescriptionTable from '../viewPrescriptionInfoPage/PrescriptionTable';
import FamilyView from '../PatientHome/PatientHome';
import AddFamilyMember from '../AddFamilyMember/AddFamilyMember';
import AppointmentsByStatusViewPatient from '../FilterAppointmentsForPatientByStatus/FilterAppointmentsForPatientByStatus';
import AppointmentsByDateViewPatient from '../FilterAppointmentsForPatientByDate/FilterAppointmentsForPatientByDate';
import LinkPatientWithAnotherByEmail from '../LinkPatientWithAnother/LinkPatientWithAnotherByEmail';
import LinkPatientWithAnotherByMobile from '../LinkPatientWithAnother/LinkPatientWithAnotherByMobile';



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
        }
    ];

    return (
        <div className={styles['main-div']}>
            <Navbar name="Patient" list={list} />
            <>
                <Routes>
                    <Route path="/patientRegister" element={<PatientRegister />} />
                    <Route path='/ViewAllDrs' element={<ViewAllDrs />} />
                    <Route path='/viewDoctorsListPage' element={< ViewDoctorsList />} />
                    <Route path='/viewDoctorInfoPage' element={< ViewDoctorInfo />} ></Route>
                    <Route path="/prescriptionTable" element={<PrescriptionTable />} />
                    <Route path="/FamilyInformation" element={<FamilyView />} />
                    <Route path="/AddFamily" element={<AddFamilyMember />} />
                    <Route path="/FilterAppointmentByStatusPatient" element={<AppointmentsByStatusViewPatient />} />
                    <Route path="/FilterAppointmentByDatePatient" element={<AppointmentsByDateViewPatient />} />
                    <Route path="/LinkPatientWithAnotherByEmail" element={<LinkPatientWithAnotherByEmail />} />
                    <Route path="/LinkPatientWithAnotherByMobile" element={<LinkPatientWithAnotherByMobile />} />
                </Routes>
            </>
        </div>
    )
}