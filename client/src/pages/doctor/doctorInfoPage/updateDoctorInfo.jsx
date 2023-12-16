import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { EditIcon } from '@chakra-ui/icons'
import { useToast,  Button, ButtonGroup, ChakraProvider } from '@chakra-ui/react'
import styles from './updateDoctorInfo.module.css';



function UpdateDoctorInfo() {
  const accessToken = sessionStorage.getItem('accessToken');
  const [load, setLoad] = useState(true);
  const [username, setUsername] = useState('');
  const [selectedOption, setSelectedOption] = useState('');
  const [doctorInfo, setDoctorInfo] = useState({
    username: username,
    email: '',
    hourly_rate: 0,
    affiliation: '',
  });

  useEffect(() => {
    if (username.length !== 0) {
      setLoad(false);
    }
  }, [username]);

  async function checkAuthentication() {
    try {
      const response = await axios({
        method: 'get',
        url: 'http://localhost:5000/authentication/checkAccessToken',
        headers: {
          'Content-Type': 'application/json',
          Authorization: accessToken,
          'User-type': 'doctor',
        },
      });

      setUsername(response.data.username);
    } catch (error) {
      // Handle authentication error
      navigate('/login');
    }
  }

  checkAuthentication();

  const [currentDoctorInfo, setCurrentDoctorInfo] = useState({
    email: '',         // Initialize with empty strings or appropriate default values
    hourly_rate: 0,
    affiliation: '',
  });

    // Fetch and set the current doctor information when the component mounts
   // console.log("username",username);
  // console.log(JSON.stringify({username: username}))
  const getCurrentDoctorInfo = async () => {
    try {
      const response = await fetch('http://localhost:5000/doctor/profile/viewDoctorInfo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: accessToken,
        },
        body: JSON.stringify({ username: username }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      if (data.doctor && data.doctor.length > 0) {
        setCurrentDoctorInfo(data.doctor[0]);
      } else {
        console.error('Invalid response format for current doctor information');
      }
    } catch (error) {
      console.error('Error fetching current doctor information', error);
    }
  };

  useEffect(() => {
    getCurrentDoctorInfo();
  }, [accessToken, username]);

 

  const handleChange = (e) => {
    const { name, value } = e.target;

    setDoctorInfo({ ...doctorInfo, [name]: value });
  };

  const handleOptionChange = (option) => {
    setSelectedOption(option);
    setDoctorInfo({
      username: username,
      email: '',
      hourly_rate: 0,
      affiliation: '',
    });
  };

  const renderInputField = () => {
    switch (selectedOption) {
      case 'email':
        return (
          <div className="updateEmail" id="email">
            <p><strong>Current Email: </strong>{currentDoctorInfo.email}</p>
            
            <label htmlFor="email">New email:</label>
            
            <input  className={`${styles['text-input']} text-input`} type="text" name="email" value={doctorInfo.email} onChange={handleChange} />
          </div>
         
        );
      case 'hourly_rate':
        return (
          <div className="updateHourlyRate" id="hourly_rate">
            <p><strong>Current Hourly Rate: </strong>{currentDoctorInfo.hourly_rate} LE</p>
           
            <label htmlFor="hourly_rate">New Hourly Rate:</label>
            
            <input className={`${styles['text-input']} text-input`}
              type="Number"
              name="hourly_rate"
              value={doctorInfo.hourly_rate}
              onChange={handleChange}
            />
          </div>
         
        );
      case 'affiliation':
        return (
          <div className="updateAffiliation" id="affiliation">
            <p><strong>Current affiliation: </strong>{currentDoctorInfo.affiliation}</p>
            
            <label htmlFor="affiliation">New affiliation:</label>
          
            <input className={`${styles['text-input']} text-input`}
              type="text"
              name="affiliation"
              value={doctorInfo.affiliation}
              onChange={handleChange}
            />
          </div>
         
        );
      default:
        return null;
    }
  };

  const handleSubmit = () => {
    if(selectedOption==''){
      alert('Please select information to update!');
      return;
    }
    if (
      (selectedOption === 'email' && doctorInfo.email === '') ||
      (selectedOption === 'hourly_rate' && doctorInfo.hourly_rate === 0) ||
      (selectedOption === 'affiliation' && doctorInfo.affiliation === '')
    ) {
      alert('Please enter the required information!');
      return;
    }
   
     if (selectedOption === 'email' && doctorInfo.email === currentDoctorInfo.email) {
      alert('Please enter a new email!');
      return;
    }
    
     if (selectedOption === 'hourly_rate'){
     let integerNumber = parseInt(doctorInfo.hourly_rate, 10);
      if( integerNumber === currentDoctorInfo.hourly_rate) {
      alert('Please enter a new hourly rate!');
      return;
    }
  }
     if (selectedOption === 'affiliation' && doctorInfo.affiliation === currentDoctorInfo.affiliation) {
      alert('Please enter a new affiliation!');
      return;
    }

    const requestBody = {
      username: username,
      email: doctorInfo.email,
      hourly_rate: doctorInfo.hourly_rate,
      affiliation: doctorInfo.affiliation,
    };

    fetch('http://localhost:5000/doctor/profile/updateDoctorInfo', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: accessToken,
        
      },
      body: JSON.stringify(requestBody),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (data) {
          setSelectedOption('');
          setDoctorInfo({
            username: username,
            email: '',
            hourly_rate: 0,
            affiliation: '',
          });
          getCurrentDoctorInfo();
          alert('Doctor updated successfully');
          location.reload();
        } else {
          alert('Doctor update failed');
        }
      })
      .catch((error) => {
        alert('This doctor does not exist');
      });
  };

  if (load) {
    return <div>Loading</div>;
  }

  const options = ['email', 'hourly_rate', 'affiliation'];

 
  return (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    <div className={styles['update-form-container']}>
      <div className={styles['bordered-container']}>
        <fieldset className={styles.fieldset}>
          <legend className={styles.legend}  style={{fontSize: '1.5em'}}><strong>Update your Info </strong> <EditIcon /></legend>
          <form className={styles.form}>
          <div className={`${styles['dropdown-container']} dropdown-container`}>
              <label style={{margin: '10px'}}>Select update option:</label>
              <select onChange={(e) => handleOptionChange(e.target.value)} value={selectedOption}>
                <option value="" disabled>
                  Select an option
                </option>
                {options.map((option) => (
                  <option key={option} value={option}>
                    {option.charAt(0).toUpperCase() + option.slice(1).replace('_', ' ')}
                  </option>
                ))}
              </select>
            </div>
            {renderInputField()}
            <ChakraProvider>
              <Button
                className={styles['update-button']}
                colorScheme="blue"
                variant="solid"
                type="button"
                onClick={handleSubmit}
              >
                Update
              </Button>
            </ChakraProvider>
          </form>
        </fieldset>
      </div>
    </div>
    </div>
  );
  
}

export default UpdateDoctorInfo;

