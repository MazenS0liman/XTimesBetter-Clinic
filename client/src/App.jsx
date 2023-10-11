import React from 'react';
// Components
import {BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';


// Styles
import './App.css'

// Pages
import  ViewAllDrs  from './pages/patient/ViewAllDrs/ViewAllDrs';
import  AddPackage  from './pages/admin/AddPackage/AddPackage';
import  UpdatePackage  from './pages/admin/UpdatePackage/UpdatePackage';
import  DeletePackage  from './pages/admin/DeletePackage/DeletePackage';





function App() {

  return (
    
    <div className='App'>
     
    <BrowserRouter>
      <Routes>
        <Route path='/patient/ViewAllDrs' element={<ViewAllDrs />}/>
        <Route path='/admin/AddPackage' element={<AddPackage />} />
        <Route path='/admin/UpdatePackage' element={<UpdatePackage />}/> 
        <Route path='/admin/DeletePackage' element={<DeletePackage />} /> 
        <Route path='*' element={<Navigate to='/' />} />
      </Routes>
    </BrowserRouter>
      
      </div>
    
  );
}

export default App