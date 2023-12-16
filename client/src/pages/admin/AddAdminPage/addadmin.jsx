import React, { useState, useEffect } from 'react';

// Axios
import axios from 'axios';

// React Router DOM
import { useNavigate } from 'react-router-dom';

const AdminTable = () => {
  const [admins, setAdmins] = useState([]);
  const [error, setError] = useState(null);
  const [showAddAdminPopup, setShowAddAdminPopup] = useState(false);

  const [newAdminData, setNewAdminData] = useState({
    username: '',
    password: '',
    firstName: '',
    lastName: '',
  });

  const fetchAdmins = async () => {
    try {
      const response = await axios.get('http://localhost:5000/Admin/addremove/admin/');
      setAdmins(response.data);
      setError(null);
    } catch (err) {
      setError('Error fetching admin data.');
      setAdmins([]);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleAddAdminClick = () => {
    setShowAddAdminPopup(true);
  };

  const accessToken = sessionStorage.getItem("accessToken");
  const [username, setUsername] = useState('');
  const [load, setLoad] = useState(true);
  const navigate = useNavigate();

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
            'User-type': 'admin',
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

  const handlePopupClose = () => {
    setShowAddAdminPopup(false);
    // Optionally, clear the form data when the pop-up is closed
    setNewAdminData({
      username: '',
      password: '',
      firstName: '',
      lastName: '',
    });
    setError(null); // Clear any previous error messages
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAdminData({
      ...newAdminData,
      [name]: value,
    });
  };

  const handleAddAdminSubmit = async (e) => {
    e.preventDefault();
    
    try {
      console.log('Request Payload:', newAdminData);
      // Check if required fields are present
      if (!newAdminData.username || !newAdminData.password ) {
        setError('Please fill in all required fields.');
        return;
      }
     console.log(newAdminData)
      const response = await axios.post('http://localhost:5000/Admin/addremove/', newAdminData);
      //console.log(response)
      console.log(response.data.success)
      if (response.data.success) {
        // Admin added successfully, close the pop-up and fetch admins again
        alert('Admin Added')
        handlePopupClose();
        fetchAdmins();
      } else {
        // Handle error scenario
        //console.log(response.data.message)
        console.error('Adding admin failed');
        setError('Adding admin failed');
      }
    } catch (error) {
      console.error('An error occurred:', error);
    
      if (error.response && error.response.status === 400 && error.response.data && error.response.data.message === 'Username already taken!') {
        setError('Username is already taken. Please choose a different username.');
      } else {
        setError(`An error occurred: ${error.message}`);
      }
    }
  };

  const handleRemoveAdmin = async (adminUsername) => {
    try {
      const response = await axios.delete(`http://localhost:5000/Admin/addremove/removeAdmin/${adminUsername}`);
      console.log(response)
      if (response.status === 200) {
        // Admin removed successfully, fetch admins again
        alert('Admin removed');
        fetchAdmins();
      } else {
        // Handle error scenario
        console.error('Removing admin failed');
        setError('Removing admin failed');
      }
    } catch (error) {
      console.error('An error occurred:', error);
      setError(`An error occurred: ${error.message}`);
    }
  };

  return (
    <div>
      <h1>Admins</h1>
      <button onClick={handleAddAdminClick}style={{ backgroundColor: 'blue', color: 'white', padding: '8px 12px', cursor: 'pointer' }}> Add Admin</button>
      {showAddAdminPopup && (
        <div className="popup">
          <div className="popup-content">
            <span className="close" onClick={handlePopupClose}>
              &times;
            </span>
            <h2>Add Admin</h2>
            <form onSubmit={handleAddAdminSubmit}>
  <div>
    <div>
      <label>Username:</label>
    </div>
    <div>
      <input
        type="text"
        name="username"
        value={newAdminData.username}
        onChange={handleInputChange}
        required
      />
    </div>
  </div>
  <div>
    <div>
      <label>Password:</label>
    </div>
    <div>
      <input
        type="password"
        name="password"
        value={newAdminData.password}
        onChange={handleInputChange}
        required
      />
    </div>
  </div>
  <div>
    <div>
      <label>First Name:</label>
    </div>
    <div>
      <input
        type="text"
        name="firstName"
        value={newAdminData.firstName}
        onChange={handleInputChange}
      />
    </div>
  </div>
  <div>
    <div>
      <label>Last Name:</label>
    </div>
    <div>
      <input
        type="text"
        name="lastName"
        value={newAdminData.lastName}
        onChange={handleInputChange}
      />
    </div>
  </div>
  <br />
  <div>
  <button type="submit" style={{ backgroundColor: 'blue', color: 'white', padding: '8px 12px', cursor: 'pointer', marginRight: '8px' }}>Add Admin</button>
  <button type="button" onClick={handlePopupClose} style={{ backgroundColor: 'red', color: 'white', padding: '8px 12px', cursor: 'pointer' }}>Cancel</button>
</div>
  <br />
  {error && <p>{error}</p>}
</form>
          </div>
        </div>
      )}
      <table>
        <thead>
          <tr>
            <th>Username</th>
            <th>First Name</th>
            <th>Last Name</th>
          </tr>
        </thead>
        <tbody>
          {admins.map((admin) => (
            <tr key={admin._id}>
              <td>{admin.username}</td>
              <td>{admin.firstName}</td>
              <td>{admin.lastName}</td>
              <td>
                <button onClick={() => handleRemoveAdmin(admin.username)}style={{ backgroundColor: 'red', color: 'white', padding: '8px 12px', cursor: 'pointer' }}>Remove</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminTable;
