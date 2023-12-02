import React from 'react';
import './App.css';

// Pages
import { MainPage } from './pages/default/DefaultPage';

// Login Page
import { LoginPage } from './pages/login/loginPage/loginPage';

// Reset Password
import { SendOtpPage } from './pages/login/sendOtpPage/sendOtpPage';
import { VerifyOtpPage } from './pages/login/verifyOtpPage/verifyOtpPage';
import { ResetPasswordPage } from './pages/login/resetPasswordPage/resetPasswordPage';

// User Type Main Pages
import { ViewDoctorMainPage } from './pages/doctor/viewDoctorMainPage/viewDoctorMainPage';
import { ViewAdminMainPage } from './pages/admin/viewAdminMainPage/viewAdminMainPage';
import { ViewPatientMainPage } from './pages/patient/viewPatientMainPage/viewPatientMainPage';

// Register Pages
import DoctorRequest from './pages/doctor/viewDoctorRequestPage/doctorRequestPage';
import PatientRegister from './pages/patient/viewRegisterationPage/patientRegisterPage';

// Hooks
import { AuthProvider } from './components/hooks/useAuth';

// React Router Dom Components
import { Routes, Route, Navigate } from 'react-router-dom';

// MUI Components
import { ResponsiveAppBar } from './components/responsiveNavBar/responsiveNavBar';
import UpdatePrescription from './pages/doctor/updatePrescription/updatePrescription';

function App() {

  return (
    <>
      <AuthProvider>
        <ResponsiveAppBar/>
        <Routes>
          {/* Home Path */}
          <Route path='/' element={<MainPage />} ></Route>
          {/* Login Path */}
          <Route path='/login' element={<LoginPage />} ></Route>
          {/* User Types Paths */}
          <Route path='/doctor/*' element={<ViewDoctorMainPage />} ></Route>
          <Route path='/admin/*' element={<ViewAdminMainPage />} ></Route>
          <Route path='/patient/*' element={<ViewPatientMainPage />} ></Route>
          {/* Register Page Paths */}
          <Route path="/doctorRequest" element={<DoctorRequest />} />
          <Route path="/patientRegister" element={<PatientRegister />} />
          {/* Reset Password Page Paths */}
          <Route path="/sendOTP" element={<SendOtpPage />} />
          <Route path="/verifyOTP" element={<VerifyOtpPage />} />
          <Route path="/resetPassword" element={<ResetPasswordPage />} />
          {/* Default Path */}
          {/* <Route path="/doctor/update-prescription/:id" element={<updatePresciption />} /> */}
          <Route path="/doctor/UpdatePrescription/:prescriptionId" element={<UpdatePrescription />} />

          <Route path='*' element={<Navigate to='/' />} />
        </Routes>
      </AuthProvider>
    </>
  );
}

export default App


