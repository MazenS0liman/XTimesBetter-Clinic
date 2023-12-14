import React, { useState, useEffect } from 'react';

function DeletePackage() {
  const [errorMessage, setErrorMessage] = useState('');
  const [packages, setPackage] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState('');

  useEffect(() => {
    // Fetch the list of packages when the component mounts
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      // Fetch the list of packages from the server
      //const response = await fetch();
      const response = await fetch('http://localhost:5000/admin/ViewPackage', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPackage(data);
      } else {
        console.error('Failed to fetch packages:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handlePackageChange = (e) => {
    setSelectedPackage(e.target.value);
  };

  const handleButtonClick = async () => {
    if (selectedPackage === '') {
      setErrorMessage('Please select a package.');
    } else {
      try {
        const apiUrl = 'http://localhost:5000/admin/deletePackage';
        const requestData = { name: selectedPackage };
        const response = await fetch(apiUrl, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestData),
        });

        setErrorMessage('');

        if (response.ok) {
          setErrorMessage('Deleted Successfully');
          console.log('Delete Successful');
          // Refresh the list of packages after deletion
          fetchPackages();
        } else if (response.status === 404) {
          setErrorMessage('No package with this name');
        } else {
          console.error('API Error:', response.statusText);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  return (
    <div>
      <h2>Delete Package</h2>
      <select value={selectedPackage} onChange={handlePackageChange}>
        <option value="" disabled>Select a package</option>
        {packages.map((item) => (
          <option key={item.name} value={item.name}>
            {item.name}
          </option>
        ))}
      </select>
      <button onClick={handleButtonClick}>Delete</button>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
    </div>
  );
}

export default DeletePackage;
