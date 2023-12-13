import React, { useState, useEffect } from 'react';
import axios from 'axios';

import './AdjustPackage.css';

function AdjustPackage() {
  const [inputs, setInputs] = useState({
    text1: '',
    text2: '',
    text3: '',
    text4: '',
    text5: '',
  });
  const [updates, setUpdates] = useState({
    text1: '',
    text2: '',
    text3: '',
    text4: '',
    text5: '',
    text6: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showInputs, setShowInputs] = useState(false);
  const [showInputsUpdate, setShowInputsUpdate] = useState(false);

  useEffect(() => {
    axios
      .get('http://localhost:5000/admin/ViewPackage')
      .then((response) => {
        setPackages(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputs({
      ...inputs,
      [name]: value,
    });
  };

  const handleUpdateChange = (e) => {
    const { name, value } = e.target;
    setUpdates({
      ...updates,
      [name]: value,
    });
  };

  const handleUpdateFirst = async (item) => {
    setShowInputsUpdate(!showInputsUpdate);
    updates.text6 = item.name;
    console.log(updates);
  }

  const handleAddClick = async () => {
    if (inputs.text1 === '' || inputs.text2 === '' || inputs.text3 === '' || inputs.text4 === '' || inputs.text5 === '') {
      alert('Please Fill All Required Fields');
    }
    else if (inputs.text3 < 0 || inputs.text3 > 100) {
      alert('Please Enter Valid Percentage for Doctor Discount');
    }
    else if (inputs.text4 < 0 || inputs.text4 > 100) {
      alert('Please Enter Valid Percentage for Medicine Discount');
    }
    else if (inputs.text5 < 0 || inputs.text5 > 100) {
      alert('Please Enter Valid Percentage for Family Discount');
    }
    else {
      try {
        const apiUrl = 'http://localhost:5000/admin/addPackage';
        const requestData = {
          name: inputs.text1,
          price: inputs.text2,
          doctor_discount: inputs.text3,
          medicine_discount: inputs.text4,
          family_discount: inputs.text5,
        };

        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestData),
        });

        if (response.ok) {
          const responseData = await response.json();
          alert('Package Added');
          window.location.reload();
          console.log('API Response:', responseData);
        } else if (response.status === 409) {
          alert('Package already Exist');
        } else {
          console.error('API Error:', response.statusText);
        }
      } catch (error) {
        console.error('Network Error:', error);
      }
    }
  };

  const handleUpdateClick = async (item) => {

    if (updates.text1 === '' && updates.text2 === '' && updates.text3 === '' && updates.text4 === '' && updates.text5 === '') {
      alert('Please Fill at Least One Field');
    }
    else if (updates.text3 < 0 || updates.text3 > 100) {
      alert('Please Enter Valid Percentage for Doctor Discount');
    }
    else if (updates.text4 < 0 || updates.text4 > 100) {
      alert('Please Enter Valid Percentage for Medicine Discount');
    }
    else if (updates.text5 < 0 || updates.text5 > 100) {
      alert('Please Enter Valid Percentage for Family Discount');
    }
    else {
      // Construct the updated data object
      const updatedData = {
        "name": updates.text1,
        "price": updates.text2,
        "doctor_discount": updates.text3,
        "medicine_discount": updates.text4,
        "family_discount": updates.text5,
        "oldname": updates.text6
      };

      try {
        console.log(updatedData);
        // Send the `updatedData` object to your backend API for processing
        const response = await fetch('http://localhost:5000/admin/updatePackage', {
          method: 'PUT', // Use PUT or PATCH depending on your API design
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedData),
        });

        if (response.ok) {

          alert('Update Successful');
          window.location.reload();

        }
        else if (response.status === 404) {
          alert('No package with this name');
        }
        else if (response.status === 406) {
          alert('Package New Name Already Exist');
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

  const handleDeleteClick = async (item) => {
    try {
      const apiUrl = 'http://localhost:5000/admin/deletePackage';
      const requestData = { name: item.name };
      const response = await fetch(apiUrl, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });



      if (response.ok) {
        alert('Deleted Successfully');
        console.log('Delete Successful');
        window.location.reload();
        // Refresh the list of packages after deletion

      } else if (response.status === 404) {
        alert('No package with this name');
      } else {
        console.error('API Error:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div >
      <div className='open-close'>
        <div className="add-package-container">
          {showInputs && (
            <>
              <div className="add-inputs">
                <h3 className="add-title">Add Package</h3>
                <div className="add-input-label">
                  <label className="add-package-label" htmlFor="text1">Name :
                  </label>
                  <input
                    className="add-package-input"
                    type="text"
                    name="text1"
                    value={inputs.text1}
                    onChange={handleInputChange}
                    autoComplete="off"
                    placeholder="Name" />

                </div>
                <div className="add-input-label">
                  <label className="add-package-label" htmlFor="text2">Price :
                  </label>
                  <input
                    className="add-package-input"
                    type="Number"
                    name="text2"
                    value={inputs.text2}
                    onChange={handleInputChange}
                    autoComplete="off"
                    placeholder="Price" />

                </div>
                <div className="add-input-label">
                  <label className="add-package-label" htmlFor="text3">Doctor Discount :</label>

                  <input

                    className="add-package-input"
                    type="Number"
                    name="text3"
                    value={inputs.text3}
                    onChange={handleInputChange}
                    autoComplete="off"
                    placeholder="Doctor Discount(%)"
                  />

                </div>
                <div className="add-input-label">
                  <label className="add-package-label" htmlFor="text4">Medicine Discount :</label>

                  <input
                    className="add-package-input"
                    type="Number"
                    name="text4"
                    value={inputs.text4}
                    onChange={handleInputChange}
                    autoComplete="off"
                    placeholder="Medicine Discount(%)"
                  />

                </div>
                <div className="add-input-label">
                  <label className="add-package-label" htmlFor="text5">Family Discount : </label>

                  <input
                    className="add-package-input"
                    type="Number"
                    name="text5"
                    value={inputs.text5}
                    onChange={handleInputChange}
                    autoComplete="off"
                    placeholder="Family Discount(%)"
                  />

                </div>

                <div>
                  <button className="add-package-button" onClick={handleAddClick}>
                    Add
                  </button>
                  <button className="toggle-inputs-button-hide" onClick={() => setShowInputs(!showInputs)}>
                    Hide
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="update-package-container">
          {showInputsUpdate && (
            <>
              <div className="update-inputs">
                <h3 className="add-title">Update Package</h3>
                <div className="add-input-label">
                  <label className="add-package-label" htmlFor="text1">Name: </label>
                  <input
                    className="add-package-input"
                    type="text"
                    name="text1"
                    value={updates.text1}
                    onChange={handleUpdateChange}
                    autoComplete="off"
                    placeholder="Name" />
                </div>
                <div className="add-input-label">
                  <label className="add-package-label" htmlFor="text5">Price : </label>
                  <input
                    className="add-package-input"
                    type="Number"
                    name="text2"
                    value={updates.text2}
                    onChange={handleUpdateChange}
                    autoComplete="off"
                    placeholder="Price" />
                </div>
                <div className="add-input-label">
                  <label className="add-package-label" htmlFor="text3">Doctor Discount :</label>
                  <input
                    className="add-package-input"
                    type="Number"
                    name="text3"
                    value={updates.text3}
                    onChange={handleUpdateChange}
                    autoComplete="off"
                    placeholder="Doctor Discount(%)"
                  />
                </div>
                <div className="add-input-label">
                  <label className="add-package-label" htmlFor="text3">Medicine Discount :</label>
                  <input
                    className="add-package-input"
                    type="Number"
                    name="text4"
                    value={updates.text4}
                    onChange={handleUpdateChange}
                    autoComplete="off"
                    placeholder="Medicine Discount(%)"
                  />
                </div>
                <div className="add-input-label">
                  <label className="add-package-label" htmlFor="text3">Family Discount :</label>
                  <input
                    className="add-package-input"
                    type="Number"
                    name="text5"
                    value={updates.text5}
                    onChange={handleUpdateChange}
                    autoComplete="off"
                    placeholder="Family Discount(%)"
                  />
                </div>
                <div>
                  <button className="update-button" onClick={() => handleUpdateClick()}>
                    Update
                  </button>
                  <button className="toggle-inputs-button-hide" onClick={() => setShowInputsUpdate(!showInputsUpdate)}>
                    Hide
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>



      <div >
        <button className="toggle-inputs-button" onClick={() => setShowInputs(!showInputs)}>

          Add New Package

        </button>

        <table className="add-package-data-table">
          <thead>
            <tr>
              <th className="add-package-table-header">Name</th>
              <th className="add-package-table-header">Price</th>
              <th className="add-package-table-header">Doctor Discount</th>
              <th className="add-package-table-header">Medicine Discount</th>
              <th className="add-package-table-header">Family Discount</th>
              <th className="add-package-table-header">Update</th>
              <th className="add-package-table-header">Delete</th>
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
                <td>


                  <button className="toggle-update-button" onClick={() => handleUpdateFirst(item)}>
                    Update
                  </button>

                </td>
                <td>
                  <button className="delete-button" onClick={() => handleDeleteClick(item)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {errorMessage && <p className="add-package-error-message">{errorMessage}</p>}
      </div>


    </div>

  );
}

export default AdjustPackage;

