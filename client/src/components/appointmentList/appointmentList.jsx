import React, { useEffect, useState } from 'react';

import styles from './appointmentList.module.css'


const appointmentList = ({ appointment, onCancel, onReschedule }) => {
       return (
        <tr key={appointment._id}>
            <td>{appointment.patient_username}</td>
            <td>{appointment.doctor_username}</td>
            <td>{appointment.date}</td>
            <td>{appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}</td>
            <td>{appointment.time}</td>
            <td>
                {appointment.status === 'upcoming' && (
                    <button className={styles['button-red']} onClick={() => onCancel(appointment._id)}>Cancel</button>
                )}
            </td>
            <td>
                {appointment.status === 'upcoming' && (
                    <button className={styles['button-blue']} onClick={() => onReschedule(appointment._id)}>Reschedule</button>
                )}
            </td>
        </tr>
    )

}

export default appointmentList