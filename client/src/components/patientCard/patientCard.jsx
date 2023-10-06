// Styles
import styles from './patientCard.module.css';


// Images

export const PatientCard = ({ patient, handleCardClick }) => {
    return (
        <div className={styles['main-card-div']} onClick={() => handleCardClick(patient.username)}>
            <div className={styles['card-pic-div']}>
                <div className={styles['main-card-img']}></div>
            </div>
            <div className={styles['card-info-div']}>
                <div className={styles['card-username-div']}><a className={styles['card-username-a']}><strong><span className={styles['card-span-info']}>Name: {patient.name}</span></strong></a></div>
                <div className={styles['card-email-div']}><a className={styles['card-email-a']}><strong><span className={styles['card-span-info']}>Gender: {patient.gender}</span></strong></a></div>
                <div className={styles['card-mobile-div']}><a className={styles['card-mobile-a']}><strong><span className={styles['card-span-info']}>Mobile: {patient.mobile}</span></strong></a></div>
            </div>
        </div>
    );
}