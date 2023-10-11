import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './medicinalUsesDDL.module.css';

import PrescriptionDetail from '../../components/prescriptionFileDetails/prescriptionDetail';

function PrescriptionTable() {
  const [prescription, setPrescriptions] = useState([]);
  const [prescriptionsToBeDisplay, setPrescriptionsToBeDisplay] = useState([]);

  useEffect(() => {
    const fetchPrescriptionData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/patient/prescriptionDetails', {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response && response.data) {
          setPrescriptions(response.data);
          setPrescriptionsToBeDisplay(response.data);
        }
      } catch (error) {
        console.error('Error fetching prescription data:', error);
      }
    };

    fetchPrescriptionData();
  }, []); // Empty dependency array ensures the effect runs once on component mount

  return (
    <div className={styles.container}>
      <h1 className={styles.listTitle}>Prescription List</h1>
      <div className={styles.resultContainer}>
        <table className={styles.prescriptionTable}>
          <thead>
            <tr>
              <th>Patient Username</th>
              <th>Doctor Username</th>
              <th>Visit Date</th>
              <th>Filled</th>
            </tr>
          </thead>
          <tbody>
            {prescriptionsToBeDisplay.map((prescription) => (
              <PrescriptionDetail key={prescription._id} prescription={prescription} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PrescriptionTable;
