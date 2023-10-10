import React, { useState } from 'react';

// Styles
import styles from './Temp.module.css';

// React Router Components
import { useNavigate } from 'react-router-dom';


export const MainPage = () => {
  const [isHovered, setIsHovered] = useState({patient: false, doctor: false, admin: false});
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <button 
        className={isHovered.patient ? styles.buttonHovered : styles.button}
        onClick={() => navigate('/patient')}
        onMouseEnter={() => setIsHovered({...isHovered, patient: true})}
        onMouseLeave={() => setIsHovered({...isHovered, patient: false})}
      >
        Patient
      </button>
      <button 
        className={isHovered.doctor ? styles.buttonHovered : styles.button}
        onClick={() => navigate('/doctor')}
        onMouseEnter={() => setIsHovered({...isHovered, doctor: true})}
        onMouseLeave={() => setIsHovered({...isHovered, doctor: false})}
      >
        Doctor
      </button>
      <button 
        className={isHovered.admin ? styles.buttonHovered : styles.button}
        onClick={() => navigate('/admin')}
        onMouseEnter={() => setIsHovered({...isHovered, admin: true})}
        onMouseLeave={() => setIsHovered({...isHovered, admin: false})}
      >
        Admin
      </button>
    </div>
  );
};

