import React, { useEffect, useState } from 'react';

function ViewRequestedDoctorsInfo() {
      const [requestedDoctors, setRequestedDoctors] = useState([]);
      const [rejected, setRejected] = useState(false);

      const fetchRequestedDoctors = () => {
        const url = 'http://localhost:5000/admin/viewREQDoctors';
    
        fetch(url)
          .then((response) => {
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
          })
          .then((data) => {
            if (data) {
              setRequestedDoctors(data);

            } else {
              console.error('Cannot view requested doctors:', data);
            }
          })
          .catch((error) => {
            console.error('Error viewing doctor information:', error);
          });
      };
    
      // Function to handle accepting a doctor
      const acceptDoctor = (doctorId) => {
        const confirmed = window.confirm('Are you sure you want to accept this doctor request?');
        if (!confirmed) {
          return;
        }
        const url = `http://localhost:5000/admin/viewREQDoctors/accept/${doctorId}`;
    
        fetch(url, { method: 'GET' })
          .then((response) => {
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }
            // Fetch the updated doctor data again to reflect the changes
            fetchRequestedDoctors();
            alert('Doctor request is accepted successfully');

          })
          .catch((error) => {
            console.error('Error accepting doctor:', error);
            alert('Error accepting doctor');

          });
          !(setAcceptClicked(true));
      };
    
      // Function to handle rejecting a doctor
      const rejectDoctor = (doctorId) => {
        const confirmed = window.confirm('Are you sure you want to reject this doctor request?');
        if (!confirmed) {
          return;
        }
        const url = `http://localhost:5000/admin/viewREQDoctors/reject/${doctorId}`;
      
        fetch(url, { method: 'GET' })
          .then((response) => {
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }
            // Fetch the updated doctor data again to reflect the changes
            fetchRequestedDoctors();
            alert('Doctor request is rejected successfully');

          })
          .catch((error) => {
            console.error('Error rejecting doctor:', error);
            alert('Error rejecting doctor');

          });
          setRejectClicked(true);

      };
      
    
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
          fetchRequestedDoctors();

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
                  <td>{doctor.dob}</td>
                  <td>{doctor.hourly_rate}</td>
                  <td>{doctor.affiliation}</td>
                  <td>{doctor.educational_background}</td>
                  <td>{doctor.status}</td>
                  <td>
                  <button
  onClick={() => acceptDoctor(doctor._id)}
  disabled={doctor.status === 'accepted' || doctor.status === 'rejected'}
>
  Accept
</button>
<br />
<button
  onClick={() => rejectDoctor(doctor._id)}
  disabled={doctor.status === 'accepted' || doctor.status === 'rejected'}
>
  Reject
</button>
                
              </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
}
       
export default ViewRequestedDoctorsInfo;