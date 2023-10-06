import React from "react";

// Styles
import styles from './patientBoard.module.css';

export const PatientBoard = () => {
  return (
    <div className={styles['patient-board-main-div']}>
        <div className={styles['patient-board-info-div']}>

        </div>
        <div className={styles['patient-appointments-div']}>

        </div>
    </div>
  );
}