import React from 'react'

// Styles
import styles from './viewPatientInfoPage.module.css';

// Images
import manImage from '../../../assets/img/man.png';
import womenImage from '../../../assets/img/woman.png';

// Components
import { PatientBoard } from '../../../components/patientBoard/PatientBoard';

// MUI Joy Components
import { Button, Typography } from '@mui/joy';

// FontAwesome Components
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

// Hooks
import { useLocation, useNavigate } from 'react-router-dom';

export function ViewPatientInfo() {
    const location = useLocation();
    const navigate = useNavigate();
    const patient = location.state;

    // Choosing image based on the gender of the patient 
    let image = null;
    if (patient.gender === 'male') {
      image = manImage;
    } else {
      image = womenImage;
    }

    // Split the patients name string into an array of strings whenever a blank space is encountered
    const arr = patient.name.split(" ");
    // Loop through each element of the array and capitalize the first letter.
    for (let i = 0; i < arr.length; i++) {
        arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
    }
    //Join all the elements of the array back into a string 
    //using a blankspace as a separator 
    patient.name = arr.join(" ");
    
    return (

        <div className={styles['patient-info-main-div']}>
          <div className={styles['patient-info-top-div']}>
            <div className={styles['patient-info-left-div']}>
              <img className={styles['patient-info-img']} src={image}></img>
            </div>
            <div className={styles['patient-info-right-div']}>
              <div className={styles['patient-information-div']}>
                <Typography level="h1" component="h1">{patient.name}</Typography>
                <div className={styles['patient-information-sub-div']}>
                  <div className={styles['patient-information-left-div']}>
                    <Typography level="title-sm">username: {patient.username}</Typography>
                    <Typography level="title-sm">email: {patient.email}</Typography>
                  </div>
                  <div className={styles['patient-information-right-div']}>
                    <Typography level="title-sm">data of birth: {patient.dob}</Typography>
                    <Typography level="title-sm">mobile: {patient.mobile}</Typography>
                  </div>
                </div>

              </div>
              <div className={styles['patient-settings-div']}>
                <Button onClick={() => navigate(-1)}><FontAwesomeIcon icon={faArrowLeft} /></Button>
              </div>
            </div>
          </div>
          <div className={styles['patient-info-bottom-div']}>
            <PatientBoard />
          </div>

      </div>

    )
}



{/* <button >Go back</button> */}
