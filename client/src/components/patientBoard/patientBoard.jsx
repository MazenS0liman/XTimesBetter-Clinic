import React from "react";

// Styles
import styles from './patientBoard.module.css';

// Components
import { AppointmentTable } from '../appointmentTable/appointmentTable';
import { EmergencyTable } from '../emergencyContactTable/emergencyContactTable';
import { HealthRecordTable } from '../healthRecordTable/healthRecordTable';

export const PatientBoard = ({ appointments, emergency_contact }) => {
  return (
    <div className={styles['patient-board-main-div']}>
        <div className={styles['patient-board-info-div']}>

        </div>
        <div className={styles['patient-appointments-div']}>
          <AppointmentTable appointments={appointments} />
          {/* <HealthRecordTable /> */}
          <EmergencyTable emergency_contact={emergency_contact} />
        </div>
    </div>
  );
}