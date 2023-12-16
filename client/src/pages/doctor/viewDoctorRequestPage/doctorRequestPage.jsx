import React, { useEffect, useState } from 'react';
import styles from './doctorRequestPage.module.css';
import { ResponsiveAppBar } from '../../../components/responsiveNavBar/responsiveNavBar';

const DoctorRequest = () => {

    
    const [formData, setFormData] = useState({
        username: '',
        name: '',
        email: '',
        password: '',
        dob: '',
        hourly_rate: '', 
        affiliation: '',
        educational_background: '', 
        speciality: '',
      });

      const [emailError, setEmailError] = useState('');
      const [passError, setPassError] = useState('');
      const [nationalID, setNationalID] = useState(null);
      const [medicalLicense, setMedicalLicense] = useState(null);
      const [medicalDegree, setMedicalDegree] = useState(null);

      const handleFileInputChange = (e) => {
        const { name, files } = e.target;
        // Assuming you allow only one file per input
        if (name === 'nationalID') {
          setNationalID(files[0]);
        } else if (name === 'medicalLicense') {
          setMedicalLicense(files[0]);
        } else if (name === 'medicalDegree') {
          setMedicalDegree(files[0]);
        }
      };
    
    // Handle input changes
      const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
          ...formData,
          [name]: value,
        });
      };

      const validateEmail = (email) => {
        const pattern = /^[a-zA-Z0-9._%+-]+@gmail.com$/;
        return pattern.test(email);
      };
      
      const validatePass = (pass) =>{
        const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
        return pattern.test(pass);
      }
    // Handle form submission
    const handleSubmit = async (e) => {
         e.preventDefault();
         if (!validateEmail(formData.email)) {
          setEmailError('Email must be in Gmail format (e.g., example@gmail.com)');
        } else{
          setEmailError(''); // Clear the error message if the email is valid
        }

        if (!validatePass(formData.password)) {
          setPassError("Please enter atleast 8 characters with number, small and capital letter.");
        } else {
          setPassError(''); // Clear the error message if the pass is valid
        }
        if (validateEmail(formData.email) && validatePass(formData.password )){
        setEmailError(''); // Clear the error message if the email is valid
        setPassError(''); // Clear the error message if the pass is valid

        const formDataToSend = new FormData();

        // Append form data
        for (const key in formData) {
          formDataToSend.append(key, formData[key]);
        }
  
        // Append uploaded files
        formDataToSend.append('nationalID', nationalID);
        formDataToSend.append('medicalLicense', medicalLicense);
        formDataToSend.append('medicalDegree', medicalDegree);
        //console.log(...formDataToSend)
        try {
            const response = await fetch('http://localhost:5000/doctor/register/', {
                method: 'POST',
                //headers: {
                //    'Content-Type': 'application/json',
                 //},
             //body: JSON.stringify(formData),
             body: formDataToSend, // Use the FormData object

            });
            const responseData = await response.json();
            if (responseData.success) {
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
                affiliation: '',
                educational_background: '', 
                speciality: '',
              });
        } else {
            // Registration failed, handle error scenario
            console.error('Registration failed');
            alert(responseData.message);
          }
        } catch (error) {
            console.error('An error occurred:', error);
            alert('An error occurred:', error);
          }
      }
    };

    return ( 

      <>
      <ResponsiveAppBar array={[]}></ResponsiveAppBar>
        <div className={styles.doctorRequestBack}>
          <div className={styles.doctorRequest}>
            <h2>Doctor Registration Request</h2>

      <form onSubmit={handleSubmit} className={styles.registrationForm}>
        {/* Add form fields for each data attribute */}
        <div className={styles.formField}>
          <label>Username:</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className={styles.formField}>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className={styles.formField}>
          <label>Email:</label>
          <input
            type="text"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        {emailError && (
            <div className={styles.errorMessage}>
              {emailError}</div>
          )}      
        </div>
        <div className={styles.formField}>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
          {passError && (
            <div className={styles.errorMessage}>
            {passError}
          </div>
        )}   
        </div>
        <div className={styles.formField}>
          <label>Date Of Birth:</label>
          <input
            type="date"
            name="dob"
            value={formData.dob}
            max={new Date().toISOString().split('T')[0]}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className={styles.formField}>
          <label>Hourly Rate:</label>
          <input
            type="Number"
            name="hourly_rate"
            value={formData.hourly_rate}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className={styles.formField}>
          <label>Affiliation:</label>
          <input
            type="text"
            name="affiliation"
            value={formData.affiliation}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className={styles.formField}>
          <label>Educational Background:</label>
          <input
            type="text"
            name="educational_background"
            value={formData.educational_background}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className={styles.formField}>
          <label>Speciality:</label>
          <input
            type="text"
            name="speciality"
            value={formData.speciality}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
           <input 
            type="hidden" 
            name="username" 
            value={formData.username} 
           />
        </div>
        <div className={styles.formField}>
          <label>National ID:</label>
          <input 
            type="file" 
            name="nationalID"
            accept=".pdf, .jpg, .jpeg, .png" 
            onChange={handleFileInputChange}
            required
          />
        </div>
        <div className={styles.formField}>
          <label>Medical License:</label>
          <input 
          type="file" 
          name="medicalLicense" 
          accept=".pdf, .jpg, .jpeg, .png" 
          onChange={handleFileInputChange}
          required
          />
        </div>
        <div className={styles.formField}>
          <label>Medical Degree:</label>
          <input 
            type="file" 
            name="medicalDegree" 
            accept=".pdf, .jpg, .jpeg, .png" 
            onChange={handleFileInputChange} 
            required
          />
        </div>
            
        {/* Submit button */}
        <button type="submit" className={styles.submitButton}>Register</button>
      </form>
      </div>
        </div>
        </>
     );
     
}
 
export default  DoctorRequest ;