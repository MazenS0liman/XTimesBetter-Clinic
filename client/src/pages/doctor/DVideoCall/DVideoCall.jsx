import React from 'react';

// Axios
import axios from 'axios';

// Styles
import './DVideoCall.module.css';

// Hooks
import { useState, useEffect  } from 'react';

// User Defined Hooks
import { useAuth } from '../../../components/hooks/useAuth';
import { useUsername } from '../../../components/hooks/useAuth';

// React Router DOM
import { useNavigate } from 'react-router-dom';

function DoctorVideo(){
  

  // Define state to store the fetched data
  const [appointments, setAppoint] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState(''); 
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();


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
              'User-type': 'doctor',
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

  const xTest = checkAuthentication();
//Authenticate part

  useEffect(() => {
   

      axios ({
        method: 'get',
        url: 'http://localhost:5000/doctor/Video/AllApointments',
        headers: {
            "Content-Type": "application/json",
            'Authorization': accessToken,
        },
      })
      .then((response) => {
        setAppoint(response.data);
        setLoading(false);
        console.log(response);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });

  
  }, []);



  const handleStartClick = async (appointID) => {
    
    try {
        const apiUrl = 'http://localhost:5000/doctor/Video/start';
        const requestData = { appointment_id:appointID._id };
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestData),
        });
        
       
        if (response.ok) {
          console.log(response)
          const apiUrl2 = `http://localhost:5000/patient/google/google?username=${appointID.patient_username}&type=patient`;
          //const requestData2 = { username:appointID.doctor_username };
          const response2 = await axios.get(apiUrl2, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
    
        
        if (response2.status==201){
                     // console.log(response2.data);
                      console.log(response2);
                      // window.location.href = response2.data;
                       window.open(response2.data, '_blank');
                       }
       
         
         
        } 
        else if (response.status===408){
          alert("Time of Appointment hasnot come yet");
        }
        else if (response.status===409){
            alert("Time of Appointment has passed");
        }

       
      } catch (error) {
       
        console.error('Error:', error);
      }
    }
  

  

  

 
//Loading 3ady lel data
  if (loading) {
    return <div>Loading...</div>;
  }

//Authenticate
  if (load) {
    return (<div>Loading</div>)
}

  if (error) {
    return <div>Error: {error.message}</div>;
  }



  return (
    <div >
      <h3 className='title'>Video Call</h3>
      <div className='table-container'>
      <table  className="data-table">
        <thead>
          <tr>
            
            <th className="table-header">Patient Name</th>
            <th className="table-header">Doctor Name</th>
            <th className="table-header">Date</th>
            <th className="table-header">Time</th>
            <th className="table-header">Status</th>
            <th className="table-header">Start Video</th>
           

           
           
          </tr>
        </thead>
        <tbody>
          {appointments.map((item) => (
            <tr key={item._id}>

              <td className="table-cell">{item.name}</td>
              <td className="table-cell">{item.doctor_username}</td>
              <td className="table-cell">{formatDate(item.time)}</td>
              <td className="table-cell">{formatTime(item.time)}</td>
              <td className="table-cell">{item.status}</td>
             

             

              <td className="table-cell" >
                <button style= {{backgroundColor:'#b5b5b5d8'}}onClick={() => handleStartClick(item)}>Start</button>
              </td>
             
            </tr>
          ))}
        </tbody>
      </table>
      {errorMessage && <p style={{ color: 'black' }}>{errorMessage}</p>}
    </div>
    </div>
  );

  }
export default DoctorVideo;

function formatDate(dateTimeString) {
  console.log(dateTimeString);
    // Check if the input date string is valid
    if (!dateTimeString) {
      return ''; // Return an empty string for invalid or missing dates
    }
  
    // Create a Date object from the date string
    const date = new Date(dateTimeString);
    date.setHours(date.getHours()-2);
    console.log(date);
  
    // Format the date as YYYY-MM-DD HH:MM:SS
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    console.log(`${year}-${month}-${day} ${hours}:${minutes}:${seconds}`);
    return `${year}-${month}-${day}`;
  }
  function formatTime(dateTimeString) {
    console.log(dateTimeString);
      // Check if the input date string is valid
      if (!dateTimeString) {
        return ''; // Return an empty string for invalid or missing dates
      }
    
      // Create a Date object from the date string
      const date = new Date(dateTimeString);
      date.setHours(date.getHours()-2);
      console.log(date);
    
      // Format the date as YYYY-MM-DD HH:MM:SS
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      const seconds = date.getSeconds().toString().padStart(2, '0');
      console.log(`${year}-${month}-${day} ${hours}:${minutes}:${seconds}`);
      return `${hours}:${minutes}:${seconds}`;
    }



   
    