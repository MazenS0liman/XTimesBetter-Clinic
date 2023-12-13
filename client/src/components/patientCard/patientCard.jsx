// Styles
import styles from './patientCard.module.css';

// Hooks
import { useState, useEffect } from 'react';

// Fontawesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCommentAlt } from '@fortawesome/free-solid-svg-icons';

export const PatientCard = ({ patient, handleCardClick, handleChatClick }) => {
    const [patientInfo, setPatientInfo] = useState(patient);

    function capitalizeFirstLetters(name) {
        // Split the patients name string into an array of strings whenever a blank space is encountered
        const arr = name.split(" ");
        // Loop through each element of the array and capitalize the first letter.
        for (let i = 0; i < arr.length; i++) {
            arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
        }
        //Join all the elements of the array back into a string 
        //using a blankspace as a separator 
        return arr.join(" ");
    }

    return (
        <div className={styles['main-card-div']}>  
            <div className={styles['extra__div']}>
                <div className={styles['chat__div']} onClick={() => 
                    {
                        console.log(`Patient Username: ${patient.username}`)
                        console.log(`Patient Name: ${patient.name}`)
                        handleChatClick(patient.name, patient.username)

                    }}>
                    <FontAwesomeIcon className={styles['chat__icon']} icon={faCommentAlt} />
                </div>
            </div>  

            <div className={styles['sub__div']} onClick={() => handleCardClick(patient.username)}>
                <div className={styles['card-pic-div']}>
                    <div className={styles['main-card-img']}>
                        {
                            patient.gender === "male" ? <img className={styles["gender__img"]} src={"../../../src/assets/img/male.svg"}/> : <img className={styles["gender__img"]}  src={"../../src/assets/img/female.svg"}/> 
                        }
                    </div>
                </div>
                <div className={styles['card-info-div']}>
                    <div className={styles['card-username-div']}><a className={styles['card-username-a']}><strong><span className={styles['card-span-info']}>Name: {capitalizeFirstLetters(patient.name)}</span></strong></a></div>
                    <div className={styles['card-mobile-div']}><a className={styles['card-mobile-a']}><strong><span className={styles['card-span-info']}>Mobile: {patient.mobile}</span></strong></a></div>
                </div>
            </div>
        </div>
    );
}