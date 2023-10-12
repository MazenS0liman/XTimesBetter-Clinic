import React, { useEffect, useState } from 'react';

import styles from './doctorList.module.css'

const doctorList = ({ doctor , handleRowClick }) => {
       return (
        <tr id = "row"  onClick={() => handleRowClick(doctor.username)}>
            <td>{doctor.name}</td>
            <td>{doctor.speciality}</td>
            <td>{doctor.hourly_rate}</td>
        </tr>
    )
}

export default doctorList