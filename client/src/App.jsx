import React from 'react';

// Styles
import './App.css'

// Pages
import {ViewPatients} from './pages/doctor/viewPatientsPage/viewPatientsPage';
import {ViewPatientInfo }from './pages/doctor/viewPatientInfoPage/viewPatientInfoPage';
import ViewRequestedDoctorsInfo from './pages/admin/viewRequestedDoctorsInfo';
import UpdateDoctorInfo from'./pages/doctor/doctorInfoPage/updateDoctorInfo.jsx';


// Components
import { Routes, Route, Navigate } from 'react-router-dom';
// import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';


function App() {

  return (
    <>
   
   
      <Routes>
        <Route path = "/doctor/viewPatientsPage" element = {<ViewPatients/>}/>
        <Route path = "/admin/requestedDoctorsInfoPage" element = {<ViewRequestedDoctorsInfo/>} />
        <Route path = "/doctor/viewPatientInfoPage" element = {<ViewPatientInfo/>} />
        <Route path = "/doctor/updateInfoPage" element = {<UpdateDoctorInfo/>} ></Route>
        <Route path='*' element={<Navigate to='/' />} />
      </Routes>
      
      </>
  );

}

export default App