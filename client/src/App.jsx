import React from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom'
import PatientRegister from './pages/guest/patientRegisterPage';
import DoctorRequest from './pages/doctor/doctorRequestPage';



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
