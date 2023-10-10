import React from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom'
import PatientRegister from './pages/guest/patientRegisterPage';
import DoctorRequest from './pages/doctor/doctorRequestPage';
import './pages/guest/patientRegisterPage.css'; // Import the CSS file
import './pages/doctor/doctorRequestPage.css'; // Import the CSS file



// Styles
import './App.css'

function App() {

  return (
    <div className = 'App'>
      <BrowserRouter>
        <Routes>
          <Route path="/guest/patientRegister" element={<PatientRegister />} />
          <Route path="/doctor/doctorRequest" element={<DoctorRequest />} />
        </Routes>
      </BrowserRouter>
   
  </div>
  )
}

export default App
