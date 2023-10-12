import React from 'react';

// Styles
import './App.css'

// Pages
import  ViewDoctorsList  from'./pages/patient/ViewDoctorListPage/ViewDoctorListPage'
import  ViewDoctorInfo  from './pages/patient/ViewDoctorInfoPage/ViewDoctorInfoPage';

// Components
import { Routes, Route, Navigate } from 'react-router-dom';


function App() {

  return (
    <>
      <Routes>
        <Route path='/patient/viewDoctorsListPage' element={< ViewDoctorsList />}/>
        <Route path='/patient/viewDoctorInfoPage' element={< ViewDoctorInfo />} ></Route>*/
        <Route path='*' element={<Navigate to='/' />} />
      </Routes>
    </>
  );
}

export default App