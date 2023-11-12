import React, { useEffect, useState } from 'react';

const HealthRecords = () => {
  const [healthRecords, setHealthRecords] = useState([]);
  const baseURL='http://localhost:5000/uploads/';
  let healthRecordURL = null;
  useEffect(() => {
    // Make an API request to fetch health records
    fetch('http://localhost:5000/patient/viewHealthRecords', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // You might need to include authentication headers if needed
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setHealthRecords(data.healthRecords);
      })
      .catch((error) => {
        console.error('Error fetching health records:', error);
      });
  }, []); // Empty dependency array means this effect runs once when the component mounts

  return (
    <div>
      <h2>Health Records</h2>
{healthRecords.length > 0 ? (
  <ul>
    {healthRecords.map((record, index) => (
      <li key={index}>
        {/* Display each health record */}
        <a href={baseURL + record} target="_blank" rel="noopener noreferrer">
          Health Record {index + 1}
        </a>
      </li>
    ))}
  </ul>
) : (
  <p>No health records found</p>
)}

    </div>
  );
};

export default HealthRecords;