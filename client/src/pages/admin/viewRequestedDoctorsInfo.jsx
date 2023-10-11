import React, { useEffect, useState } from 'react';

function ViewRequestedDoctorsInfo() {
    
      const [requestedDoctors, setRequestedDoctors] = useState([]);
       
      useEffect(() => {
        const url = `http://localhost:5000/admin/viewREQDoctors`
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
                setRequestedDoctors(data);
                
              } else {
                console.error('Can not view requested doctor:', data);
               
              }
          })
          .catch((error) => {
            console.error('Error viewing doctor information : ', error);
            console.log('This Requested doctor does not exist');
          });
      },[]);
      return (
        <div>
          <h1>Requested Doctors List</h1>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Speciality</th>
                <th>Username</th>
                <th>Email</th>
                <th>Password</th>
                <th>Date of Birth</th>
                <th>Hourly Rate</th>
                <th>Affiliation</th>
                <th>Educational Background</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {requestedDoctors.map((doctor) => (
                <tr key={doctor._id}>
                  <td>{doctor.name}</td>
                  <td>{doctor.speciality}</td>
                  <td>{doctor.username}</td>
                  <td>{doctor.email}</td>
                  <td>{doctor.password}</td>
                  <td>{doctor.dob}</td>
                  <td>{doctor.hourly_rate}</td>
                  <td>{doctor.affiliation}</td>
                  <td>{doctor.educational_background}</td>
                  <td>{doctor.status}</td>
                  
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
}
       
export default ViewRequestedDoctorsInfo;