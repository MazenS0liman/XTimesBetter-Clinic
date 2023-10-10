import React from 'react';
import { Routes, Route } from 'react-router-dom'
import PatientMedicineCatalog from './pages/patient/prescriptionDetailsPage';
// Styles
import './App.css'

function App() {

  return (

    <div>
      <Routes>
        <Route path="/patient/prescriptionDetails" element={<PatientMedicineCatalog />} />
      </Routes>
    </div>

  )
}

export default App