import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './medicinalUsesDDL.module.css';
//import PrescriptionDetail from '../../../components/prescriptionFileDetails/prescriptionDetail';
import { useAuth } from '../../../components/hooks/useAuth';
import { jsPDF } from "jspdf";

const PrescriptionTable = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [prescriptionsToBeDisplay, setPrescriptionsToBeDisplay] = useState([]);
  const [selectedPrescription, setSelectedPrescription] = useState([]);

  const [filter, setFilter] = useState('all'); // Initialize with 'all' as no filter
  const [filterValue, setFilterValue] = useState(''); // Input value for doctor_username or visit_date
  const [showModal, setShowModal] = useState(false);
 //Authenticate part
 const accessToken = sessionStorage.getItem('accessToken');
 const [load, setLoad] = useState(true);
 const [username, setUsername] = useState('');
 
 console.log(accessToken);
 useEffect(() => {
     if (username.length != 0) {
         setLoad(false);
     }
 }, [username]);
 async function checkAuthentication() {
     await axios({
         method: 'get',
         url: 'http://localhost:5000/authentication/checkAccessToken',
         headers: {
             "Content-Type": "application/json",
             'Authorization': accessToken,
             'User-type': 'patient',
         },
     })
         .then((response) => {
             console.log(response);
             setUsername(response.data.username);
             //setLoad(false);
         })
         .catch((error) => {
             //setLoad(false);
             navigate('/login');

         });
 }
 const generatePDF = (prescription) => {
  const doc = new jsPDF({
    orientation: 'p',
    unit: 'mm',
    format: [310, 270]
  });
  const pageWidth = doc.internal.pageSize.getWidth();

  // Title
  doc.setFontSize(19);
  doc.text('Prescription Details', pageWidth / 2, 20, { align: 'center' });

  // Subtitle
  doc.setFontSize(14);
  doc.text(`Prescription From Dr.${prescription.doctor_username}`, pageWidth / 2, 30, { align: 'center' });

  // Body
  doc.setFontSize(12);
  doc.setFont(undefined, 'normal');

  const bodyStartY = 40;
  // doc.text(`Doctor: ${prescription.doctor_username}`, 20, bodyStartY+10);
  doc.text(`Visit Date: ${prescription.visit_date}`, 20, bodyStartY + 10);
  doc.text(`Filled: ${prescription.filled ? 'Yes' : 'No'}`, 20, bodyStartY + 20);

  // Medicines Section
  doc.setFont(undefined, 'bold');
  doc.text('Medicines:', 20, bodyStartY + 30);
  doc.setFont(undefined, 'normal');

  prescription.medicines.forEach((medicine, index) => {
    const y = bodyStartY + 40 + (10 * index);
    doc.text(`- ${medicine.name}`, 30, y);
    doc.text(`Dose: ${medicine.dose}`, 80, y);
    doc.text(`Timing: ${medicine.timing}`, 130, y);
    doc.text(`Price: ${medicine.price}`, 230, y);
  });

  // Save the PDF
  doc.save(`prescription_${prescription.patient_username}.pdf`);
};


 const xTest = checkAuthentication();
//Authenticate part

  useEffect(() => {
    const fetchPrescriptionData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/patient/prescriptionDetails', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': accessToken,
        },
        });

        if (response && response.data) {
          // console.log(response.data);
          // console.log(response.data[0].medicines);
          // console.log(response.data);
          // console.log(response.data.patient_username);
          setPrescriptions(response.data);
          setPrescriptionsToBeDisplay(response.data);
          // setSelectedPrescription(response.data.medicines);
         

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

  const handleSelectPrescription = (selectedPrescription) => {
     setSelectedPrescription(selectedPrescription);
    setShowModal(true);
  };

  const closePrescriptionModal = () => {
    setSelectedPrescription([]);
    setShowModal(false);
  };
  const handleUpdateClick = (prescriptionId) => {
    const appData = { prescriptionId: prescriptionId };
  
    // Navigate to the second component and pass prescriptionId as a URL parameter
    navigate(`/doctor/UpdatePrescription/${prescriptionId}`);
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
              {/* <th>Patient Username</th> */}
              <th>Doctor Username</th>
              <th>Visit Date</th>
              <th>Filled</th>
              <th>Select</th> {/* selecting a prescription */}
              <th>Download As PDF</th> {/* downloading prescription as pdf*/}
              <th>Buy</th>
            </tr>
          </thead>
          <tbody>
        {prescriptionsToBeDisplay.map((prescription) => (
          <tr key={prescription._id}>
            {/* <td>{prescription.patient_username}</td> */}
            <td>{prescription.doctor_username}</td>
            <td>{prescription.visit_date}</td>
            <td>{prescription.filled ? 'Filled' : 'Unfilled'}</td>
            <td>
              <button onClick={() => handleSelectPrescription(prescription)}>Select</button>
            </td>
            <td>
              <button onClick={() => generatePDF(prescription)}>Download</button>
            </td>
            <td>
              <button 
              onClick={() => handleUpdateClick(prescription._id)}
              >
                Buy
                </button>
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
        <div className={styles.additionalInfo}>
          <p>Selected Successfully</p>
        </div>
        <h2>Prescription Details</h2>
        <ul>
          {selectedPrescription.medicines.map((medicine, index) => (
            <li key={index}>
      <span className={styles.label}>Name:</span> {medicine.name}<br />
      <span className={styles.label}>Dose:</span> {medicine.dose}<br />
      <span className={styles.label}>Timing:</span> {medicine.timing}<br />
      <span className={styles.label}>Price:</span> {medicine.price}<br />

    </li>
          ))}
        </ul>
      </div>
    </div>
  )}
</div>
);
}
export default PrescriptionTable;