import React from 'react'

// Axios
import axios from 'axios';

// Styles
import styles from './viewPatientInfoPage.module.css';

// Images
import manImage from '../../../assets/img/male.svg';
import womenImage from '../../../assets/img/female.svg';

// User Defined Components
import { PatientBoard } from '../../../components/patientBoard/PatientBoard';

// MUI Joy Components
import { Button, Typography } from '@mui/joy';

// FontAwesome Components
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

// Hooks
import { useLocation, useNavigate } from 'react-router-dom';

// User Defined Hooks
import { useAuth } from '../../../components/hooks/useAuth';

// Components
import { ShowCard } from '../../../components/showCard/showCard';
import { Modal } from '../../../components/modalCard/modalCard';

// Pages
import UploadRecords from '../uploadHealthRecordsPage/uploadHealthRecords';
import PHealthRecords from '../viewHealthPage/viewHealthPage';

// MUI Components
import AccessTimeIcon from '@mui/icons-material/AccessTime';

export function ViewPatientInfo() {
    const location = useLocation();
    const navigate = useNavigate();
    // const {accessToken} = useAuth();
    const accessToken = sessionStorage.getItem("accessToken");
    const patient = location.state;
    console.log("Patient Info:");
    console.log(patient);

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
      })
      .catch((error) => {
        navigate('/');
      });
    }

    // Check that user is authenticated to view this page
    checkAuthentication();

    // Choosing image based on the gender of the patient 
    let image = null;
    if (patient !== null && patient.gender === 'male') {
      image = manImage;
    } else {
      image = womenImage;
    }

    if(patient !== null) {
      // Split the patients name string into an array of strings whenever a blank space is encountered
      const arr = patient.name.split(" ");
      // Loop through each element of the array and capitalize the first letter.
      for (let i = 0; i < arr.length; i++) {
          arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
      }
      //Join all the elements of the array back into a string 
      //using a blankspace as a separator 
      patient.name = arr.join(" ");
    }

    if (patient === null) {
      return (<div>No patient exist</div>);
    }
    
    return (
        <div className={styles['patient-info-main-div']}>
          <div className={styles['patient-info-top-div']}>
            <div className={styles['patient-info-left-div']}>
              <img className={styles['patient-info-img']} src={image}></img>
            </div>
            <div className={styles['patient-info-right-div']}>
              <div className={styles['patient-information-div']}>
                <Typography level="h1" component="h1" sx={{color: 'white'}}>{patient.name}</Typography>
                <div className={styles['patient-information-sub-div']}>
                  <div className={styles['patient-information-left-div']}>
                    <Typography level="title-sm" sx={{color: 'white'}}>username: {patient.username}</Typography>
                    <Typography level="title-sm" sx={{color: 'white'}}>email: {patient.email}</Typography>
                  </div>
                  <div className={styles['patient-information-right-div']}>
                    <Typography level="title-sm" sx={{color: 'white'}}>data of birth: {patient.dob}</Typography>
                    <Typography level="title-sm" sx={{color: 'white'}}>mobile: {patient.mobile}</Typography>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={styles['patient__settings__div']}>
            <ShowCard title="view health records"><Modal title="View Health Records"><PHealthRecords patient_username={patient.username}/></Modal></ShowCard>
            <ShowCard title="upload health recrods"><Modal title="Upload Health Records"><UploadRecords patient_username={patient.username}/></Modal></ShowCard>
          </div>
          <div className={styles['patient-info-bottom-div']}>
            <PatientBoard appointments={patient.appointments} emergency_contact={patient.emergency_contact}/>
          </div>
      </div>

    )
}

