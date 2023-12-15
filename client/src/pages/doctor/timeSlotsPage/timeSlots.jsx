import React, { useState, useEffect } from 'react';

// Axios
import axios from 'axios';

// Styles
import styles from './timeSlots.module.css';

//  React Router DOM
import { useNavigate } from 'react-router-dom';

const AddTimeSlots = () => {
  const [formData, setFormData] = useState({
    availableTimeSlots: [],
  });

  const accessToken = sessionStorage.getItem("accessToken");
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [load, setLoad] = useState(true);

  useEffect(() => {
    if (username.length != 0) {
      setLoad(false);
    }
  }, [username]);

  async function checkAuthentication() {
    await axios ({
        method: 'get',
        url: `http://localhost:5000/authentication/checkAccessToken`,
        headers: {
            "Content-Type": "application/json",
            'Authorization': accessToken,
            'User-type': 'doctor',
        },
    })
    .then((response) => {
        console.log(response);
        setUsername(response.data.username);
    })
    .catch((error) => {
      navigate('/login');
    });
  }

  checkAuthentication();

  if (load) {
    return(<div>Loading</div>)
  }

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value.split(',').map((slot) => slot.trim()), // Convert comma-separated string to an array
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send the formData object to your backend API for registration
      const response = await fetch('http://localhost:5000/doctor/addTimeSlot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': accessToken,
        },
        body: JSON.stringify(formData),
      });
      console.log(response);
      if (response.status == 200) {
        // Registration was successful, handle success scenario
        console.log('Time Slots added!');
        alert('Time Slots added!');
        e.target.reset(); // This will clear all form input fields
        setFormData({
          availableTimeSlots: [],
        });
      } else {
        const errorMessage = await response.json(); // Extract error message from the response
        // Registration failed, handle error scenario
        console.error('Can not add time slots');
        alert(`Error: ${errorMessage.message}`);
      }
    } catch (error) {
      console.error('An error occurred:', error);
      alert('An error occurred:', error); // Here, you should use `error`, not `errorMessage`
    }
  };

  return (
    <div className={styles["timeSlots"]}>
      <form className={styles['timeSlot__form']} onSubmit={handleSubmit}>
        {/* Add form fields for each data attribute */}
        <div className={styles['sub__div']}>
        <label>Select Date and Time:</label>
          <input
            type="datetime-local"
            name="availableTimeSlots"
            className={styles['timeSlot__input']}
            value={formData.availableTimeSlots.length > 0 ? formData.availableTimeSlots[0] : ''}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* Add similar fields for other attributes */}

        {/* Submit button */}
        <button type="submit" className={styles['timeSlot__btn']}>Add</button>
      </form>
    </div>
  );
};

export default AddTimeSlots;