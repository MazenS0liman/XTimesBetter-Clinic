import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import PrescriptionTable from './pages/patient/PrescriptionTable';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/patient/prescriptionTable" element={<PrescriptionTable />} />
      </Routes>
    </div>
  );
}

export default App;
