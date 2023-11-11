import React, { useEffect, useState } from 'react';

import styles from './appointmentList.module.css'


const appointmentList = ({ appointment }) => {
       return (
        <tr key={appointment._id}>
            <td>{appointment.patient_username}</td>
            <td>{appointment.doctor_username}</td>
            <td>{appointment.date}</td>
            <td>{appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}</td>
            <td>{appointment.time}</td>
        </tr>
    )

}

export default appointmentList