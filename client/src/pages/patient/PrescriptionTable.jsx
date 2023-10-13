import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './medicinalUsesDDL.module.css';
import PrescriptionDetail from '../../components/prescriptionFileDetails/prescriptionDetail';

const PrescriptionTable=() =>{
  const [prescriptions, setPrescriptions] = useState([]);
  const [prescriptionsToBeDisplay, setPrescriptionsToBeDisplay] = useState([]);
  const [filter, setFilter] = useState('all'); // Initialize with 'all' as no filter
  const [filterValue, setFilterValue] = useState(''); // Input value for doctor_username or visit_date
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchPrescriptionData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/patient/prescriptionDetails', {
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
 
  const handleFilterClick = () => {
    // Apply the filter logic based on user input
    const filteredPrescriptions = prescriptions.filter((prescription) => {
      if (filter === 'filled') {
        return prescription.filled === true;
      } else if (filter === 'unfilled') {
        return prescription.filled === false;
      } else if (filter === 'doctor_username') {
        if (filterValue) {
          return prescription.doctor_username.toLowerCase().includes(filterValue.toLowerCase());
        }
      } else if (filter === 'visit_date') {
        if (filterValue) {
          return prescription.visit_date === filterValue;
        }
      }
      return true; // No filter
    });

    setPrescriptionsToBeDisplay(filteredPrescriptions);
  };
  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const handleFilterValueChange = (event) => {
    setFilterValue(event.target.value);
  };

  const handleSelectPrescription = (prescription) => {
    setSelectedPrescription(prescription);
    setShowModal(true);
  };

  const closePrescriptionModal = () => {
    setSelectedPrescription(null);
    setShowModal(false);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.listTitle}>Prescription List</h1>
      <div className={styles.resultContainer}>
        <div className={styles.filterContainer}>
          <label htmlFor="filterSelect">Filter By: </label>
          <select id="filterSelect" value={filter} onChange={handleFilterChange}>
            <option value="all">No Filter</option>
            <option value="filled">Filled</option>
            <option value="unfilled">Unfilled</option>
            <option value="doctor_username">Doctor Username</option>
            <option value="visit_date">Visit Date</option>
          </select>
          &nbsp;&nbsp;
          {['doctor_username', 'visit_date'].includes(filter) && (
            <input
              type="text"
              value={filterValue}
              onChange={handleFilterValueChange}
              placeholder={`Enter ${filter === 'doctor_username' ? 'Doctor Username' : 'Visit Date'}`}
            />
          )}
          &nbsp;
          &nbsp;&nbsp;
          <button onClick={handleFilterClick}>Filter</button>
        </div>
        <table className={styles.prescriptionTable}>
          <thead>
            <tr>
              <th>Patient Username</th>
              <th>Doctor Username</th>
              <th>Visit Date</th>
              <th>Filled</th>
              <th>Select</th> {/* Add a column for selecting a prescription */}
            </tr>
          </thead>
          <tbody>
            {prescriptionsToBeDisplay.map((prescription) => (
              <tr key={prescription._id}>
                <td>{prescription.patient_username}</td>
                <td>{prescription.doctor_username}</td>
                <td>{prescription.visit_date}</td>
                <td>{prescription.filled ? 'Filled' : 'Unfilled'}</td>
                <td>
                  <button onClick={() => handleSelectPrescription(prescription)}>Select</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showModal && selectedPrescription && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <span className={styles.closeButton} onClick={closePrescriptionModal}>
              &times;
            </span>
            <div className={styles.additionalInfo}> {/* Create a new CSS class for styling */}
              <p>Selected Successfully</p>
            </div>
            <h2>Prescription Details</h2>
            <p>Patient Username: {selectedPrescription.patient_username}</p>
            <p>Doctor Username: {selectedPrescription.doctor_username}</p>
            <p>Visit Date: {selectedPrescription.visit_date}</p>
            <p>Filled: {selectedPrescription.filled ? 'Yes' : 'No'}</p>
            {/* Add more information and customize the modal appearance */}
         
          </div>
        </div>
      )}
    </div>
  );}
export default PrescriptionTable;
