import React from 'react';

// Styles
import './App.css'

// Pages
import { ViewPatients } from './pages/doctor/viewPatientsPage/viewPatientsPage';
import { ViewPatientInfo } from './pages/doctor/viewPatientInfoPage/viewPatientInfoPage';

// Components
import { Routes, Route, Navigate } from 'react-router-dom';


function App() {

  return (
    <>
      <Routes>
        <Route path='/doctor/viewPatientsPage' element={<ViewPatients />}/>
        <Route path='/doctor/viewPatientInfoPage' element={<ViewPatientInfo />} ></Route>
        <Route path='*' element={<Navigate to='/' />} />
      </Routes>
    </>
  );
}

export default App
