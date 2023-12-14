import axios from 'axios';

import { useState, useEffect } from "react";

import { useNavigate, useLocation } from "react-router-dom";
import styles from './viewNotificationsPage.module.css';
import { Button, ChakraProvider, Box } from '@chakra-ui/react';


import newAppointment from '../../../assets/images/new.png'
import cancel from '../../../assets/images/cancel.png'
import reschedule from '../../../assets/images/reschedule.png'

function PatientNotifications() {
  const navigate = useNavigate();

  //new part
  const accessToken = sessionStorage.getItem('accessToken');
  const [load, setLoad] = useState(true);
  const [username, setUsername] = useState('');
  const [notifications, setNotifications] = useState([]);
  // console.log(accessToken);
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
        //console.log(response);
        setUsername(response.data.username);
        //setLoad(false);
      })
      .catch((error) => {
        //setLoad(false);
        navigate('/login');

      });
  }

  checkAuthentication();

  
  useEffect(() => {
    if (username.length !== 0) {
      setLoad(false);

  fetch('http://localhost:5000/patient/notifications', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': accessToken,
    },

    body: JSON.stringify({username: username})


}).then(res => {
    // console.log("Response", res)
    return res.json();

}).then((data) => {
    //console.log("Data in notifications", data.notifications)
    setNotifications(data.notifications);

    

})
}
}, [username]);
console.log(" notifications", notifications)

  if (load) {
    return (<div>Loading</div>)
  }

  // return (
  //   <div>
  //     <h2>Notifications</h2>
  //     <ul>
  //       {notifications.map((notification) => (
  //         <li key={notification.timestamp}>
  //           {notification.message} .
  //         </li>
  //       ))}
  //     </ul>
  //   </div>
  // );

  const handleSubmit = () => {
    navigate('/patient/');
  }
  // Function to get the image source based on notification type
const getImageSource = (type) => {
  switch (type) {
    case 'new':
      return newAppointment;
    case 'cancelled':
      return cancel;
    case 'rescheduled':
      return reschedule;
    default:
      return null;
  }
};
  // calculate the time difference
  const calculateTimeDifference = (timestamp) => {
    const currentTime = new Date();
    const notificationTime = new Date(timestamp);
    const timeDifference = currentTime - notificationTime;

    const hoursDifference = Math.floor(timeDifference / (1000 * 60 * 60));
    const daysDifference = Math.floor(hoursDifference / 24);
    if (hoursDifference < 1)
      return `few minutes ago`;

    if (hoursDifference < 24) {
      return `${hoursDifference} hours ago`;
    } else {
      return `${daysDifference} days ago`;
    }
  };

  return (
    <div style={{ backgroundColor: '#f4f4ff' }}>
      <div className={styles['update-form-container']} >
        <div className={styles['bordered-container']}>
          <h2 style={{ fontSize: '1.5em', marginTop: '30px', marginBottom: '30px' }}>
            <strong>Notifications</strong>
          </h2>
          <div style={{ display: 'flex', justifyContent: 'center', height: '70vh' }}>
            <Box
              overflowY="auto"  // Add vertical scrollbar when content overflows
              height="400px" // Adjust the height based on your preference
              width="100%"
              border="1px solid #ccc"
              borderRadius="10px"
              padding="30px"
            >
              {notifications.map((notification) => (
                <div key={notification.timestamp} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                  <img
                    src={getImageSource(notification.type)}
                    alt="X"
                    style={{ width: '50%', maxWidth: '50px', marginRight: '10px' }}
                  />
                  <span>{notification.message} - {calculateTimeDifference(notification.timestamp)}</span>
                </div>
              ))}

            </Box>
          </div>
          <ChakraProvider>
            <Button
              className={`${styles['update-button']} ${styles['update-info']}`}
              colorScheme="blue"
              variant="solid"
              type="button"
              onClick={handleSubmit}
            >
              home
            </Button>
          </ChakraProvider>
        </div>
      </div>
    </div>
  );



}
export default PatientNotifications;