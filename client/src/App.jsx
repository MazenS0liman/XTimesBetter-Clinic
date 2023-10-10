import React from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom'
import PatientRegister from './pages/guest/patientRegisterPage';
import './pages/guest/patientRegisterPage.css'; // Import the CSS file



// Styles
import './App.css'

function App() {

  return (
    <div className = 'App'>
      <BrowserRouter>
        <Routes>
          <Route path="/guest/patientRegister" element={<PatientRegister />} />
        </Routes>
      </BrowserRouter>
   
  </div>
  )
}

export default App
