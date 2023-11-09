import React from 'react';

// Axios
import axios from 'axios';

// Styles
import './ViewPackagesDetails.css';

// Hooks
import { useState, useEffect  } from 'react';

// User Defined Hooks
import { useAuth } from '../../../components/hooks/useAuth';
import { useUsername } from '../../../components/hooks/useAuth';

// React Router DOM
import { useNavigate } from 'react-router-dom';

function PackagesList(){
  const {accessToken} = useAuth();
  const {username} = useUsername();
  // Define state to store the fetched data
  const [packages, setPackages] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [familyMembers, setFamilyMembers] = useState([]); // State for family members
  const [selectedPackage, setSelectedPackage] = useState('');
  const [selectedFamilyMember, setSelectedFamilyMember] = useState(''); 
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  async function checkAuthentication() {
    await axios ({
        method: 'get',
        url: `http://localhost:5000/authentication/checkAccessToken`,
        headers: {
            "Content-Type": "application/json",
            'Authorization': accessToken,
            'User-type': 'patient',
        },
    })
    .then((response) => {
        console.log(response);
    })
    .catch((error) => {
      navigate('/login');
    });
  }

  checkAuthentication();

  useEffect(() => {
    // Make an API request to fetch the list of packages
    axios
      .get('http://localhost:5000/patient/ViewPackages/viewP')
      .then((response) => {
        setPackages(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });

      //supposed to get it from the session
      axios ({
        method: 'get',
        url: 'http://localhost:5000/patient/ViewPackages/viewF',
        headers: {
            "Content-Type": "application/json",
            'Authorization': accessToken,
        },
      })
      .then((response) => {
        setFamilyMembers(response.data);
        console.log(response);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, []);

//   const handlePackageChange = (inputPackage) =>  {
//     setSelectedPackage(inputPackage);

//   };

  const handleFamilyMemberChange = (event) => {
    setSelectedFamilyMember(event.target.value);
  };

  const handleSubscribeClick = async (packageName) => {
    
    if (selectedFamilyMember===""){
        setErrorMessage("Please choose a person to subscribe to");
    }
    
    else{
    try {
        const apiUrl = 'http://localhost:5000/patient/Subscribe';
  
        // Prepare the request data (customize as needed)
        const requestData = {
            patient_username:selectedFamilyMember,
            package_name:packageName
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
        
        // Check if the request was successful (status code 200)
        if (response.ok) {
          const responseData = await response.json();
          setErrorMessage("Subscribed Successfully");
          console.log('Success:', responseData);
        } 
        else if (response.status===409){
            setErrorMessage("Already subscribed to a Package");
            //console.log(response);
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

  if (error) {
    return <div>Error: {error.message}</div>;
  }



  return (
    <div>
      <h3>Package Details</h3>
      <table  className="data-table">
        <thead>
          <tr>
            
            <th className="table-header">Name</th>
            <th className="table-header">Price</th>
            <th className="table-header">Doctor Discount</th>
            <th className="table-header">Medicine Discount</th>
            <th className="table-header">Family Discount</th>
            <th className="table-header">Subscribe For</th>
            <th className="table-header">Subscribe</th>

           
           
          </tr>
        </thead>
        <tbody>
          {packages.map((item) => (
            <tr key={item.name}>

              <td className="table-cell">{item.name}</td>
              <td className="table-cell">{item.price}</td>
              <td className="table-cell">{item.doctor_discount}</td>
              <td className="table-cell">{item.medicine_discount}</td>
              <td className="table-cell">{item.family_discount}</td>

              <td className="table-cell">
                <select value={selectedFamilyMember} onChange={handleFamilyMemberChange}>
                  <option value="">Select Family Member</option>
                  {/*should get it from the session*/}
                  <option value={username}>Myself</option>
                  
                  {familyMembers.map((member) => (
                    <option key={member.id} value={member.username}>
                      {member.name}
                    </option>
                  ))}
                </select>
              </td>

              <td className="table-cell">
                <button onClick={() => handleSubscribeClick(item.name)}>Subscribe</button>
              </td>
             
            </tr>
          ))}
        </tbody>
      </table>
      {errorMessage && <p style={{ color: 'black' }}>{errorMessage}</p>}
    </div>
  );
//}
}
export default PackagesList;



   
    