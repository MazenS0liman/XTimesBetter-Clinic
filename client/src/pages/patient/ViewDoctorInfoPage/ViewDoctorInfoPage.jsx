import React from 'react'

// Styles
import styles from './viewDoctorInfoPage.module.css';

// Components
import doctorInfo from '../../../components/doctorInfo/doctorInfo';

// MUI Joy Components
import { Button, Typography } from '@mui/joy';

// FontAwesome Components
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

// Hooks
import { useLocation, useNavigate } from 'react-router-dom';

const ViewDoctorInfo = () => {
    const location = useLocation();
    console.log(location)
    const doctor = location.state;


    const navigate = useNavigate();

    /*
    // Split the patients name string into an array of strings whenever a blank space is encountered
    const arr = doctor.name.split(" ");
    // Loop through each element of the array and capitalize the first letter.
    for (let i = 0; i < arr.length; i++) {
        arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
    }
    //Join all the elements of the array back into a string 
    //using a blankspace as a separator 
    patient.name = arr.join(" ");
    */

    return (
        <div className={styles['patient-info-main-div']}>
          <div className={styles['patient-info-top-div']}>
            <div className={styles['patient-info-right-div']}>
              <div className={styles['patient-information-div']}>
                <Typography level="h1" component="h1">Dr. {doctor.name}</Typography>
                <br></br>
                <div className={styles['patient-info-main-div']}>
                  <div className={styles['doctor-info']}>
                    <Typography level="title-sm">Speciality: {doctor.speciality}</Typography>
                    <br></br>
                    <Typography level="title-sm">Affiliation: {doctor.affiliation}</Typography>
                    <br></br>
                    <Typography level="title-sm">Eductational Background: {doctor.educational_background}</Typography>
                  </div>
                </div>
              </div>
              <div className={styles['patient-settings-div']}>
                <Button onClick={() => navigate(-1)}><FontAwesomeIcon icon={faArrowLeft} /></Button>
              </div>
            </div>
          </div>
      </div>

    )
}

export default ViewDoctorInfo