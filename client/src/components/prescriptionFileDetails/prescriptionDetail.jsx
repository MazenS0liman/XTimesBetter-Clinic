import React, { useEffect, useState } from 'react';

import styles from './medicineDetails.module.css'

const PrescriptionDetail = ({ medicine }) => {

    return (
        <tr>
            <td>{medicine.patient_username}</td>
            <td>{medicine.doctor_username}</td>
            <td>{medicine.visit_date}</td>
            <td>{medicine.filled}</td>
        </tr>
    )
}
Í
export default PrescriptionDetail