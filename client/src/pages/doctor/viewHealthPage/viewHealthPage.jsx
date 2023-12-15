import React, { useState, useEffect } from 'react';

// Axios
import axios from 'axios';

//  React Router DOM
import { useNavigate } from 'react-router-dom';

// Styles
import styles from './viewHealthPage.module.css';

const PHealthRecords = (patient) => {
  const [username, setUsername] = useState(patient);
  const [healthRecords, setHealthRecords] = useState([]);
  const baseURL = 'http://localhost:5000/uploads/';

  const accessToken = sessionStorage.getItem("accessToken");
  const navigate = useNavigate();
  const [doctorUsername, setDoctorUsername] = useState('');
  const [load, setLoad] = useState(true);

  console.log("Patient Username");
  console.log(patient);
  
  const handleSubmit = async () => {
    // e.preventDefault();

    console.log(`Patient Username: ${patient.patient_username}`);

    try {
      const response = await fetch(`http://localhost:5000/doctor/viewPHealthRecords/${patient.patient_username}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': accessToken,
        },
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        console.log(data.healthRecords);
  
        setHealthRecords(data.healthRecords);
      } else {
        const errorMessage = await response.json(); // Extract error message from the response
        console.error('Error fetching health records:', errorMessage);
        alert(`Error: ${errorMessage.message}`);
        setHealthRecords([]);
      }
    } catch (error) {
      console.error('Error fetching health records:', error);
      alert(`Error: ${error.message}`);
      setHealthRecords([]);
    }
  };

  useEffect(() => {
    handleSubmit();
  }, [patient]);

  useEffect(() => {
    if (doctorUsername.length != 0) {
      setLoad(false);
    }
  }, [doctorUsername]);

  async function checkAuthentication() {
    await axios ({
        method: 'get',
        url: `http://localhost:5000/authentication/checkAccessToken`,
        headers: {
            "Content-Type": "application/json",
            'Authorization': accessToken,
            'User-type': 'doctor',
        },
    })
    .then((response) => {
        console.log(response);
        setDoctorUsername(response.data.username);
    })
    .catch((error) => {
      navigate('/login');
    });
  }

  checkAuthentication();

  if (load) {
    return(<div>Loading</div>)
  }

  const handleUsernameChange = (e) => {
    setUsername(e.target.value, () => {
      console.log(username);
    });
  };

  return (
    <div className={styles['main__div']}>
      {healthRecords.length > 0 ? (
        <ul className={styles['health__ul']}>
          {healthRecords.map((record, index) => (
            <li key={index} className={styles['health__li']}>
              {/* Display each health record */}
              <a href={baseURL + record} target="_blank" rel="noopener noreferrer">
                Health Record {index + 1}
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p>No health records found</p>
      )}
    </div>
  );
};

export default PHealthRecords;