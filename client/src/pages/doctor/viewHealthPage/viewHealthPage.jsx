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
    const requestdata={username:username}
    try {
      const response = await fetch('http://localhost:5000/patient/viewPHealthRecords', {
        method: 'GET', // Change method to GET
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestdata), // GET requests don't have a request body
      });
  
  
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        console.log(data.healthRecords);

        setHealthRecords(data.healthRecords);
        //setHealthRecords(data);

      } else {
        console.error('Error fetching health records:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching health records:', error);
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