/*import { BrowserRouter, Routes, Route } from 'react-router-dom'
// pages & components 
import PatientHome from './pages/PatientHome'


function App() {
  return (
    <div className="App">
      
      <BrowserRouter>
        <div className='pages'>
          <Routes>
            <Route
              path="/"
              element={<PatientHome />}
              
            />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;*/
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
// Styles
import './App.css'
import FamilyView from './pages/patient/PatientHome.jsx';
import AddFamilyMember from './pages/patient/AddFamilyMember';
import AppointmentsByStatusViewPatient from './pages/patient/FilterAppointmentsForPatientByStatus';
import AppointmentsByStatusViewDoctor from './pages/doctor/FilterAppointmentsForDoctorByStatus';
import AppointmentsByDateViewPatient from './pages/patient/FilterAppointmentsForPatientByDate';
import AppointmentsByDateViewDoctor from './pages/doctor/FilterAppointmentsForDoctorByDate';

function App() {

  return (
    <div className='App'>
      <BrowserRouter>
        <div className="pages">
          <Routes>
            <Route
              path="/FamilyInformation"
              element={<FamilyView />}
            />
            <Route
              path="/AddFamily"
              element={<AddFamilyMember />}
            />
            <Route
              path="/FilterAppointmentByStatusPatient"
              element={<AppointmentsByStatusViewPatient />}
            />
            <Route
              path="/FilterAppointmentByStatusDoctor"
              element={<AppointmentsByStatusViewDoctor />}
            />
            <Route
              path="/FilterAppointmentByDatePatient"
              element={<AppointmentsByDateViewPatient />}
            />
            <Route
              path="/FilterAppointmentByDateDoctor"
              element={<AppointmentsByDateViewDoctor />}
            />




          </Routes>
        </div>
      </BrowserRouter>

    </div>
  )
}

export default App
