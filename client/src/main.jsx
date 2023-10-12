import React from 'react'
import ReactDOM from 'react-dom/client'

// Styles
import './index.css'

// App
import App from './App.jsx'

// Components
import { BrowserRouter } from 'react-router-dom'



ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
