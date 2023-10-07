// Styles
import styles from './patientCard.module.css';


// Images

export const PatientCard = ({ patient, handleCardClick }) => {

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
        <div className={styles['main-card-div']} onClick={() => handleCardClick(patient.username)}>
            <div className={styles['card-pic-div']}>
                <div className={styles['main-card-img']}></div>
            </div>
            <div className={styles['card-info-div']}>
                <div className={styles['card-username-div']}><a className={styles['card-username-a']}><strong><span className={styles['card-span-info']}>Name: {capitalizeFirstLetters(patient.name)}</span></strong></a></div>
                <div className={styles['card-email-div']}><a className={styles['card-email-a']}><strong><span className={styles['card-span-info']}>Gender: {patient.gender}</span></strong></a></div>
                <div className={styles['card-mobile-div']}><a className={styles['card-mobile-a']}><strong><span className={styles['card-span-info']}>Mobile: {patient.mobile}</span></strong></a></div>
            </div>
        </div>
    );
}