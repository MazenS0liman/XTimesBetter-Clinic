import React from 'react';
import './App.css';

// Pages
import { MainPage } from './Temp';
import { LoginPage } from './pages/login/loginPage/loginPage';
import { ViewDoctorMainPage } from './pages/doctor/viewDoctorMainPage/viewDoctorMainPage';
import { ViewAdminMainPage } from './pages/admin/viewAdminMainPage/viewAdminMainPage';
import { ViewPatientMainPage } from './pages/patient/viewPatientMainPage/viewPatientMainPage';

// Hooks
import { AuthProvider } from './components/hooks/useAuth';

// React Router Dom Components
import { Routes, Route, Navigate } from 'react-router-dom';


function App() {
  return (
    <>
      <AuthProvider>
        <Routes>
          <Route path='/' element={<MainPage />} ></Route>
          <Route path='/login' element={<LoginPage />} ></Route>
          <Route path='/doctor/*' element={<ViewDoctorMainPage />} ></Route>
          <Route path='/admin/*' element={<ViewAdminMainPage />} ></Route>
          <Route path='/patient/*' element={<ViewPatientMainPage />} ></Route>

          <Route path='*' element={<Navigate to='/' />} />
        </Routes>
      </AuthProvider>
    </>
  );

}

export default App


