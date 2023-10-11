
import styles from './medicineDetails.module.css'
import React from 'react';

const PrescriptionDetail = ({ prescription }) => {
  return (
    <tr>
      <td>{prescription.patient_username}</td>
      <td>{prescription.doctor_username}</td>
      <td>{prescription.visit_date}</td>
      <td>{prescription.filled ? 'Filled' : 'Unfilled'}</td>
    </tr>
  );
};

export default PrescriptionDetail;
