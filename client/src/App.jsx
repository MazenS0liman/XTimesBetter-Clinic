import React from 'react';

// Styles
import './App.css'

// Pages
import { MainPage } from './Temp';
import { ViewDoctorMainPage } from './pages/doctor/viewDoctorMainPage/viewDoctorMainPage';
import { ViewAdminMainPage } from './pages/admin/viewAdminMainPage/viewAdminMainPage';
import { ViewPatientMainPage } from './pages/patient/viewPatientMainPage/viewPatientMainPage';



// React Router Dom Components
import { Routes, Route, Navigate } from 'react-router-dom';
// import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

function App() {

  return (
    <>
   
   
      <Routes>
        <Route path='/' element={<MainPage />} ></Route>
        <Route path='/doctor/*' element={<ViewDoctorMainPage />} ></Route>
        <Route path='/admin/*' element={<ViewAdminMainPage />} ></Route>
        <Route path='/patient/*' element={<ViewPatientMainPage />} ></Route>
        
       
        
        {/* <Route path = "/doctor/viewPatientsPage" element = {<ViewPatients/>}/>
        <Route path = "/admin/requestedDoctorsInfoPage" element = {<ViewRequestedDoctorsInfo/>} />
        <Route path = "/doctor/viewPatientInfoPage" element = {<ViewPatientInfo/>} />
        <Route path = "/doctor/updateInfoPage" element = {<UpdateDoctorInfo/>} ></Route> */}
        <Route path='*' element={<Navigate to='/' />} />
      </Routes>
      
      </>
  );

}

export default App


