import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './medicinalUsesDDL.module.css';

//components
import PrescriptionDetail from '../../components/prescriptionFileDetails/prescriptionDetail';

function PrescriptionTable() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [prescriptionsToBeDisplay, setprescriptionsToBeDisplay] = useState([]);

  useEffect(() => {
    const fetchPrescriptionData = async () => {
      try {
        const response = await axios.get('/api/prescriptions', {
          headers: {
              'Content-Type': 'application/json',
          },
      });       
       const data = await response.json();
       if (response && response.data) {

        setPrescriptions(response.data);
        setPrescriptionsToBeDisplay(response.data); // Populate prescriptionsToBeDisplay
       }
      } catch (error) {
        console.error('Error fetching prescription data:', error);
      }
    };

    fetchPrescriptionData();
  }, []);

  return (
    <>
      <h1 className={styles["list-title"]}>Prescription List</h1>
      <div className={styles["result-container"]}>
        <table>
          <thead>
            <tr>
              <th>Patient Username</th>
              <th>Doctor Username</th>
              <th>Visit Date</th>
              <th>Filled</th>
            </tr>
          </thead>
          <tbody>
            {
            prescriptionsToBeDisplay && prescriptionsToBeDisplay.map((prescription) => {// Updated variable name
              return <PrescriptionDetail key={prescription._id} prescription={prescription} /> // Updated prop name
            })
            }
          </tbody>
        </table>
      </div>
    </>
  );
}
export default PrescriptionTable;