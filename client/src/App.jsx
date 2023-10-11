import React from 'react';

// Styles
import './App.css'

// Pages
import { MainPage } from './Temp';
import { ViewDoctorMainPage } from './pages/doctor/viewDoctorMainPage/viewDoctorMainPage';
import { ViewAdminMainPage } from './pages/admin/viewAdminMainPage/viewAdminMainPage';
import { ViewPatientMainPage } from './pages/patient/viewPatientMainPage/viewPatientMainPage';

// Pages
import  ViewAllDrs  from './pages/patient/ViewAllDrs/ViewAllDrs';
import  AddPackage  from './pages/admin/AddPackage/AddPackage';
import  UpdatePackage  from './pages/admin/UpdatePackage/UpdatePackage';
import  DeletePackage  from './pages/admin/DeletePackage/DeletePackage';


// React Router Dom Components
import { Routes, Route, Navigate } from 'react-router-dom';

function App() {

  return (
    <>
      <Routes>
        <Route path='/' element={<MainPage />} ></Route>
        <Route path='/doctor/*' element={<ViewDoctorMainPage />} ></Route>
        <Route path='/admin/*' element={<ViewAdminMainPage />} ></Route>
        <Route path='/patient/*' element={<ViewPatientMainPage />} ></Route>
        
        <Route path='/patient/ViewAllDrs' element={<ViewAllDrs />}/>
        <Route path='/admin/AddPackage' element={<AddPackage />} />
        <Route path='/admin/UpdatePackage' element={<UpdatePackage />}/> 
        <Route path='/admin/DeletePackage' element={<DeletePackage />} /> 
        <Route path='*' element={<Navigate to='/' />} />
      </Routes>
    </>
  );
}

export default App
