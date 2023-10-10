import React, { useEffect, useState } from 'react';
//import axios from 'axios';
const DoctorRequest = () => {

    const [formData, setFormData] = useState({
        username: '',
        name: '',
        email: '',
        password: '',
        dob: '',
        hourly_rate: '', 
        affilitation: '',
        educational_background: '', 
        speciality: '',
      });

    // Handle input changes
      const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
          ...formData,
          [name]: value,
        });
      };

    // Handle form submission
    const handleSubmit = async (e) => {
         e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/doctor/register/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                 },
             body: JSON.stringify(formData),
            });
            
        if (response.ok) {
            // Registration was successful, handle success scenario
            console.log('Registration successful!');
            alert('Registration successful!');
            e.target.reset(); // This will clear all form input fields
            setFormData({
                username: '',
                name: '',
                email: '',
                password: '',
                dob: '',
                hourly_rate: '', 
                affilitation: '',
                educational_background: '', 
                speciality: '',
              });
        } else {
            // Registration failed, handle error scenario
            console.error('Registration failed');
            alert('Registration failed ');
        }
        } catch (error) {
            console.error('An error occurred:', error);
            alert('An error occurred:', error);
        }
    };

    return ( 
        <div className='doctorRequest'>
            <h2>Doctor Registration Request</h2>
      <form onSubmit={handleSubmit}>
        {/* Add form fields for each data attribute */}
        <div>
          <label>Username:</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="text"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="text"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Date Of Birth:</label>
          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Hourly Rate:</label>
          <input
            type="text"
            name="hourly_rate"
            value={formData.hourly_rate}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Affilitation:</label>
          <input
            type="text"
            name="affilitation"
            value={formData.affilitation}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Educational Background:</label>
          <input
            type="text"
            name="educational_background"
            value={formData.educational_background}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Speciality:</label>
          <input
            type="text"
            name="speciality"
            value={formData.speciality}
            onChange={handleInputChange}
            required
          />
        </div>
        
        
        {/* Submit button */}
        <button type="submit">Register</button>
      </form>
        </div>
     );
}
 
export default  DoctorRequest ;