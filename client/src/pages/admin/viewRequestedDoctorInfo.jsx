import React, { useState } from 'react';
function ViewRequestedDoctorInfo() {
    const[doctorInfo, setDoctorInfo] = useState({
        username: ''
      });
      const [requestedDoctor, setRequestedDoctor] = useState(null);
      const handleChange = (e) => {
        const { name, value } = e.target;
      
        if (name === 'username') {
          setDoctorInfo({ ...doctorInfo, username: value });
        }
      };  
      const handleSubmit = () => {
        const data = {
          param1: doctorInfo.username
}         ;
        const url = `http://localhost:5000/admin/viewREQDoctor?username=${data.param1}`
        // Make an HTTP PATCH request to send the data to the backend using the requestBody
        fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
          // body: JSON.stringify(requestBody),
        }).then((response) => {
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
          }).then((data) => {
           // console.log(data.success);
            if (data) {
                console.log('Requested Doctor:', data);
                setRequestedDoctor(data[0]);
                
              } else {
                console.error('Can not view requested doctor:', data);
               
              }
          })
          .catch((error) => {
            console.error('Error viewing doctor information : ', error);
            console.log('This Requested doctor does not exist');
          });
      };
      return (
        <div className="choose">
          <h2>Enter requested Doctor username</h2>
          
          <div className="username" id="username">
              <label htmlFor="username"> Doctor username: </label>
              <input
                type="text"
                name="username"
                value={doctorInfo.username}
                onChange={handleChange}
                
              />
            </div>
    
         <button type="button" onClick={handleSubmit}>
            View information
          </button>
          {requestedDoctor && (
        <div style={{ display: requestedDoctor ? 'block' : 'none' }}>
          <h3>Requested Doctor Information:</h3>
          <p>Doctor Name: {requestedDoctor?.name}</p>
          <p>Username: {requestedDoctor?.username}</p>
          <p>Email: {requestedDoctor?.email}</p>
          <p>password: {requestedDoctor?.password}</p>
          <p>Date of Birth: {requestedDoctor?.dob}</p>
          <p>Hourly Rate: {requestedDoctor?.hourly_rate}</p>
          <p>Affiliation: {requestedDoctor?.affiliation}</p>
          <p>Educational Background: {requestedDoctor?.educational_background}</p>
          <p>Status: {requestedDoctor?.status}</p>
        </div>
      )}
    </div>
  );
}
       

export default ViewRequestedDoctorInfo;