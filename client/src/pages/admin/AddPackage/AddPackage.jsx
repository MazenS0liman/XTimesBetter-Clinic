import React, { useState , useEffect } from 'react';

// Axios
import axios from 'axios';

import './AddPackage.css';


function AddPackage() {
  // State to store input values
  const [inputs, setInputs] = useState({
    text1: '',
    text2: '',
    text3: '',
    text4: '',
    text5: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Make an API request to fetch the list of packages
    axios
      .get('http://localhost:5000/admin/ViewPackage')
      .then((response) => {
        setPackages(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setErrorMessage(error);
        setLoading(false);
      });
    }, []);
  // Function to handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputs({
      ...inputs,
      [name]: value,
    });
    console.log(inputs);
  };

  // Function to handle button click and make API request
  const handleButtonClick = async () => {
    if (inputs.text1 === '' || inputs.text2 === '' || inputs.text3 === ''|| inputs.text4 === '' ||inputs.text5 === '' ) {
      setErrorMessage('Please enter some text.');
    } 

    else{
      try {

      // Define the API endpoint (replace with your API URL)
      const apiUrl = 'http://localhost:5000/admin/addPackage';

      // Prepare the request data (customize as needed)
      const requestData = {
        name: inputs.text1,
        price: inputs.text2,
        doctor_discount: inputs.text3,
        medicine_discount:inputs.text4,
        family_discount:inputs.text5,
      };
      console.log(requestData);

      // Make the API request using the Fetch API (POST request in this example)
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });
      console.log(response);
      // Check if the request was successful (status code 200)
      if (response.ok) {
        const responseData = await response.json();
        setErrorMessage('Package Added');
        window.location.reload();
        // Handle the response data here
        console.log('API Response:', responseData);
      } 
      else if (response.status===409){
        setErrorMessage('Package already Exist');
      }
      else {
        // Handle API error (e.g., show an error message)
        console.error('API Error:', response.statusText);
      }
    } catch (error) {
      // Handle any network or other errors
      console.error('Network Error:', error);
    }
  }
    
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
    <div className="add-package-container">
    <h2>Add new Package</h2>
      <input
      className="add-package-input"
        type="text"
        name="text1"
        value={inputs.text1}
        onChange={handleInputChange}
        placeholder="Name"
      />
      <input
       className="add-package-input"
        type="Number"
        name="text2"
        value={inputs.text2}
        onChange={handleInputChange}
        placeholder="Price"
      />
      <input
       className="add-package-input"
        type="Number"
        name="text3"
        value={inputs.text3}
        onChange={handleInputChange}
        placeholder="Doctor Discount"
      />
      <input
       className="add-package-input"
        type="Number"
        name="text4"
        value={inputs.text4}
        onChange={handleInputChange}
        placeholder="Medicine Discount"
      />
      <input
       className="add-package-input"
        type="Number"
        name="text5"
        value={inputs.text5}
        onChange={handleInputChange}
        placeholder="Family Discount"
      />
       <div>
      <button className="add-package-button" onClick={handleButtonClick}>Submit</button>
      </div>
      </div>

  <div>
      <table  className="add-package-data-table">
        <thead>
          <tr>
            
            <th className="add-package-table-header">Name</th>
            <th className="add-package-table-header">Price</th>
            <th className="add-package-table-header">Doctor Discount</th>
            <th className="add-package-table-header">Medicine Discount</th>
            <th className="add-package-table-header">Family Discount</th>
           
           
           
          </tr>
        </thead>
        <tbody>
          {packages.map((item) => (
            <tr key={item.name}>
              <td className="add-package-table-cell">{item.name}</td>
              <td className="add-package-table-cell">{item.price}</td>
              <td className="add-package-table-cell">{item.doctor_discount}</td>
              <td className="add-package-table-cell">{item.medicine_discount}</td>
              <td className="add-package-table-cell">{item.family_discount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {errorMessage && <p className="add-package-error-message">{errorMessage}</p>}
    </div>
     </div>
  );
}

export default AddPackage;
