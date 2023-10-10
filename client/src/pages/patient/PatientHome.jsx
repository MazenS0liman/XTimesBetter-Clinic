import React, { useEffect, useState } from 'react';
import axios from 'axios';

const FamilyView = () => {

    const [member, setMembers] = useState([]);
    //for display
    const [membersToBeDisplay, setMembersToBeDisplay] = useState([]);


    useEffect(() => {
        const fetchAllMembers = async () => {
            try {
                const response = await axios.get('http://localhost:5000/patient/viewFamilyMembers', {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (response && response.data) {
                    setMembers(response.data);
                    setMembersToBeDisplay(response.data) //so that initially all medicines are displayed
                }
            } catch (error) {
                throw new Error('Invalid response data');
            }
        };

        fetchAllMembers();

    }, []);


    const handleViewFamilyMembers = () => {
        setMembersToBeDisplay(member);
    };

    return (
        <div>
            <h2>Family Members</h2>
            <button onClick={handleViewFamilyMembers}>View Family Members</button>
            {member && (
                <div>
                    <h3>Family Members for {member.username}</h3>
                </div>
            )}
        </div>
    );
};

export default FamilyView;


/*import { useEffect, useState } from "react";

const PatientHome = () => {
    const [familyMembers, setFamilyMembers] = useState(null)

    useEffect(() => {
        const getFamilyMembers = async () => {
            const response = await fetch('/patient/viewFamilyMembers')
            const json = await response.json()

            if (response.ok) {
                setFamilyMembers(json)
            }
        }

        getFamilyMembers()
    }, [])

    return (
        <div className="patientHome">
            <div className="familyMembers">
                {familyMembers && familyMembers.map((familymember) => (
                    <p key={familymember._id}>{familymember.name}</p>

                ))}

            </div>
        </div>
    )
}

export default PatientHome;*/
//import { useEffect, useState } from "react";

//function FamilyView() {
/*const [username, setUsername] = useState('');
const [patient, setPatient] = useState(null);
 
const handleUsernameChange = (event) => {
  setUsername(event.target.value);
};*/

/*const fetchFamilyMembers = async () => {
    try {
        const response = await fetch(`http://localhost:5000/patient/viewFamilyMembers`);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
    } catch (error) {
        console.error('Error fetching family members:', error);
        // You can set an error state or display an error message to the user here.
    }
};

return (
    <div>
        <h2>Family Members</h2>
        <button onClick={fetchFamilyMembers}>Fetch Family Members</button>
        {patient && (
            <div>
                <h3>Family Members for {patient.username}</h3>
                <p>Name: {patient.name}</p>
                <p>Email: {patient.email}</p>
                <p>Date of Birth: {patient.dob}</p>
                <p>Gender: {patient.gender}</p>

            </div>

        )}
    </div>
);
}

export default FamilyView;*/
/*return (
       <div className="home">
           <h2>Family Members</h2>
       </div>
   )*/

