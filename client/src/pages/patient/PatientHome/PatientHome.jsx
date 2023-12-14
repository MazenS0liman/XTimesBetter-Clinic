
import React, { useState, useEffect, useRef } from 'react';
import styles from './PatientHome.module.css'
import AddFamilyMember from '../AddFamilyMember/AddFamilyMember';
import LinkPatientWithAnotherByEmail from '../LinkPatientWithAnother/LinkPatientWithAnotherByEmail';
import LinkPatientWithAnotherByMobile from '../LinkPatientWithAnother/LinkPatientWithAnotherByMobile';
// Axios
import axios from 'axios';

// User Defined Hooks
import { useAuth } from '../../../components/hooks/useAuth';

// React Router DOM
import { useNavigate } from 'react-router-dom';


const FamilyView = () => {
    const accessToken = sessionStorage.getItem('accessToken');
    const [familyMembers, setFamilyMembers] = useState([]);
    const [showFamilyMembers, setShowFamilyMembers] = useState(false);
    const [showAddFamilyMember, setShowAddFamilyMember] = useState(false);
    const [showLinkByEmail, setShowLinkByEmail] = useState(false);
    const [showLinkByMobile, setShowLinkByMobile] = useState(false);
    const navigate = useNavigate();

    const addFamilyMemberRef = useRef(null);
    const linkByEmailRef = useRef(null);
    const linkByMobileRef = useRef(null);

    async function checkAuthentication() {
        await axios({
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
        const fetchFamilyMembers = async () => {
            const response = await fetch('http://localhost:5000/patient/viewFamilyMembers/', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': accessToken,
                },
            });
            // console.log("anaaaaaaaaaaaa")
            const familyMembers = await response.json();

            if (response.ok) {
                setFamilyMembers(familyMembers);
            }

        };

        fetchFamilyMembers();
    }, []);

    const handleViewFamilyMembers = async () => {
        setShowFamilyMembers(true);
    };

    const handleToggleAddFamilyMember = () => {
        setShowAddFamilyMember(!showAddFamilyMember);
    };
    const handleToggleLinkByEmail = () => {
        setShowLinkByEmail(!showLinkByEmail);
    };
    const handleToggleLinkByMobile = () => {
        setShowLinkByMobile(!showLinkByMobile);
    };

    useEffect(() => {
        if (showAddFamilyMember && addFamilyMemberRef.current) {
            // Scroll to the added family member form
            window.scrollTo({
                top: addFamilyMemberRef.current.offsetTop - 100,
                behavior: 'smooth',
            });
        }
    }, [showAddFamilyMember]);
    useEffect(() => {
        if (showLinkByEmail && linkByEmailRef.current) {
            window.scrollTo({
                top: linkByEmailRef.current.offsetTop - 100,
                behavior: 'smooth',
            });
        }
    }, [showLinkByEmail]);
    useEffect(() => {
        if (showLinkByMobile && linkByMobileRef.current) {
            window.scrollTo({
                top: linkByMobileRef.current.offsetTop - 100,
                behavior: 'smooth',
            });
        }
    }, [showLinkByMobile]);

    return (
        <div className={styles['Nayerafamily-view-container']}>
            <h1>Family Members</h1>
            <div className={styles['Nayerabutton-container']}>
                <button className={styles.Nayerabutton} onClick={handleToggleAddFamilyMember}>
                    {showAddFamilyMember ? 'Hide Add Family Member' : 'Add Family Member'}
                </button>
                <button className={styles.Nayerabutton} onClick={handleToggleLinkByMobile}>
                    {showLinkByMobile ? 'Hide Link by Phone Number' : 'Link Patient by Phone Number'}
                </button>
                <button className={styles.Nayerabutton} onClick={handleToggleLinkByEmail}>
                    {showLinkByEmail ? 'Hide Link by Email' : 'Link Patient by Email'}
                </button>
            </div>
            {showAddFamilyMember && (
                <div className={styles['Nayeraadd-family-member-container']} ref={addFamilyMemberRef}>
                    <AddFamilyMember />
                </div>
            )}
            {showLinkByEmail && (
                <div className={styles['LinkByEmail-container']} ref={linkByEmailRef}>
                    <LinkPatientWithAnotherByEmail />
                </div>
            )}
            {showLinkByMobile && (
                <div className={styles['LinkByMobile-container']} ref={linkByMobileRef}>
                    <LinkPatientWithAnotherByMobile />
                </div>
            )}
            <table className={styles['family-table']}>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Relation</th>
                        {/* <th>Type</th> Add this column for the type */}
                    </tr>
                </thead>
                <tbody>
                    {familyMembers.map((member) => (
                        <tr key={member._id}>
                            <td>
                                <h2>{member.name}</h2>
                            </td>
                            <td>
                                <p>{member.relation}</p>
                            </td>
                            {/* <td>
                                <p>{member.type}</p>
                            </td> */}
                        </tr>
                    ))}
                </tbody>
            </table>

        </div>
    );

};

export default FamilyView;

/*import React, { useEffect, useState } from 'react';
import axios from 'axios';
const FamilyView = () => {

    const [familyMembers, setFamilyMembers] = useState([]);

    const handleViewFamilyMembers = async () => {
        const response = await axios.get('http://localhost:5000/patient/viewFamilyMembers?username=NayeraMahran');
        const familyMembers = response.data;
        console.log(familyMembers);
        //console.log("familyMembers");

        // Check if the response data is empty
        if (familyMembers.length > 0) {
            setFamilyMembers(familyMembers);
        } else {
            // Display an error message
            alert('No family members found');
        }
    };

    return (
        <div>
            <h1>Family Members</h1>
            <button onClick={handleViewFamilyMembers}>View Family Members</button>

            {familyMembers.length > 0 && (
                <ul>
                    {familyMembers.map((member) => (
                        <li key={member._id}>
                            <h2>{member.name}</h2>
                            <p>Age: {member.age}</p>
                            <p>Relation: {member.relation}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default FamilyView;*/
// RESTORE UP

/*const FamilyView = () => {

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


    const handleViewFamilyMembers = async () => {
        const member3 = member.find(member => member.patient_username === "NayeraMahran");
        if (member3) {
            setMembersToBeDisplay(member3);
        }
    };*/



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

/* <div>
 <h2>Family Members</h2>
 <button onClick={handleViewFamilyMembers}>View Family Members</button>
 {membersToBeDisplay.length > 0 && ( // conditional statement to render the list of family members only if the membersToBeDisplay state variable is not empty
     <div>
         <h3>Family Members for :{member3.patient_username}</h3>
         <p> Name: {membersToBeDisplay.name}</p>
         <p>Relation: {membersToBeDisplay.relation}</p>
     </div>
 )}
</div>*/
