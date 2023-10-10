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

          </Routes>
        </div>
      </BrowserRouter>

    </div>
  )
}

export default App
