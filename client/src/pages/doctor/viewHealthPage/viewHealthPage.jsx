import React, { useState } from 'react';

const PHealthRecords = () => {
  const [username, setUsername] = useState('');
  const [healthRecords, setHealthRecords] = useState([]);
  const baseURL = 'http://localhost:5000/uploads/';

  const handleUsernameChange = (e) => {
    setUsername(e.target.value, () => {
      console.log(username);
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log({ username });
    //const requestdata={username:username}
    try {
      const response = await fetch(`http://localhost:5000/doctor/viewPHealthRecords/${username}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        console.log(data.healthRecords);
  
        setHealthRecords(data.healthRecords);
      } else {
        const errorMessage = await response.json(); // Extract error message from the response
        console.error('Error fetching health records:', errorMessage);
        alert(`Error: ${errorMessage.message}`);
        setHealthRecords([]);
      }
    } catch (error) {
      console.error('Error fetching health records:', error);
      alert(`Error: ${error.message}`);
      setHealthRecords([]);
    }
  };

  return (
    <div>
      <h2>Health Records</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Username:
          <input 
  type="text" 
  value={username} 
  onChange={handleUsernameChange} 
  required
/>
        </label>
        <button type="submit">Fetch Health Records</button>
      </form>

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

export default PHealthRecords;