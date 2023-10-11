import React from 'react';
import{Routes, Route, BrowserRouter} from 'react-router-dom'
import AddAdmin from './pages/admin/addadmin';
import RemoveAdmin from './pages/admin/removeadmin';
import RemovePatient from './pages/admin/removepatient';
import RemoveDoctor from './pages/admin/removedoctor';

// Styles
import './App.css'

function App() {

  return (
    <div className='App'>
      <BrowserRouter>
      <Routes>
        <Route path="/admin/addadmin" element={<AddAdmin/>}/>
        <Route path="/admin/removeadmin" element={<RemoveAdmin/>}/>
        <Route path="/admin/removepatient" element={<RemovePatient/>}/>
        <Route path="/admin/removedoctor" element={<RemoveDoctor/>}/>
        
      </Routes>
      </BrowserRouter>

    </div>
  )
}

export default App


