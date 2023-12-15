import React, { useState, useEffect } from 'react';
import styles from './ViewContract.module.css';
// Axios
import axios from 'axios';

// User Defined Hooks
import { useAuth } from '../../../components/hooks/useAuth';

// React Router DOM
import { useNavigate } from 'react-router-dom';

const ContractView = () => {
    // const {accessToken} = useAuth();
    const accessToken = sessionStorage.getItem('accessToken');
    const [contract, setContract] = useState([]);
    const [accepted, setAccepted] = useState(false);
    const [rejected, setRejected] = useState(false);
    const navigate = useNavigate();

    async function checkAuthentication() {
        await axios({
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
            })
            .catch((error) => {
                navigate('/login');
            });
    }

    checkAuthentication();

    useEffect(() => {
        const fetchContract = async () => {
            const response = await fetch('http://localhost:5000/doctor/viewContract/viewContract', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': accessToken,
                },
            });
            // console.log("anaaaaaaaaaaaa")
            const contract = await response.json();

            if (response.ok) {
                setContract(contract);
            }

        };

        fetchContract();
    }, []);


    const handleAcceptContract = async () => {
        if (!accepted) {
            const response = await fetch('http://localhost:5000/doctor/acceptContract/acceptContract', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': accessToken,
                },
            });
            // console.log("anaaaaaaaaaaaa")
            //  const newcontract = await response.json();

            if (response.ok) {
                console.log("accepted");
                setAccepted(true);
                window.location.reload();
            }
            else {
                // Handle any errors from the backend
                console.error('Error accepting contract:', response.statusText);
            }
        }

    };
    const handleRejectContract = async () => {
        if (!rejected) {
            const response = await fetch('http://localhost:5000/doctor/rejectContract/rejectContract', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': accessToken,
                },
            });
            // console.log("anaaaaaaaaaaaa")
            //  const newcontract = await response.json();

            if (response.ok) {
                console.log("rejected");
                setRejected(true);
                window.location.reload();
            }
            else {
                // Handle any errors from the backend
                console.error('Error accepting contract:', response.statusText);
            }
        }

    };
    // const handleAcceptContract = async () => {
    //     setShowContract(true);
    // };

    return (
        <div>
            {contract.map((contract) => (
                <div key={contract._id}className={styles.ContractContainer}>
                 <div className={styles.ContractContent}>
                    <p>X-Virtual Clinic</p>
                    <p>New Cairo City - Main Entrance of Al Tagamoa Al Khames, Egypt</p>
                    <p>Contract Date: 11/11/2023</p>

                    <p>
                        <h2 style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{contract.doctorName} Mohamed ElSalanty <br /></h2>
                        <p style={{display: 'flex', alignItems: 'center', justifyContent: 'flex-end'}}>Zahraa-ElMaadi, Cairo, Egypt</p> <br />
                        Dear Dr. {contract.doctorName},
                    </p>

                    <p>
                        This Employment Agreement is entered into between "X-Virtual Clinic"
                        (hereinafter referred to as the "Clinic") and Dr. {contract.doctorName}
                        (hereinafter referred to as the "Doctor"), collectively referred to as
                        the "Parties," effective as of {contract.employmentDate}.
                    </p>

                    <h3>1. Position and Duties:</h3>
                    <p>
                        The Clinic agrees to employ the Doctor as a "Dentist" in the
                        Dentistry Department. The Doctor agrees to diligently and
                        professionally perform all duties related to their position.
                    </p>

                    <h3>2. Employment Term:</h3>
                    <p>
                        This agreement shall commence on {contract.employmentDate} and shall
                        continue until terminated by either party with a notice period of 2
                        months or for cause as outlined in Section 5.
                    </p>

                    <h3>3. Compensation:</h3>
                    <p>
                        a. The Clinic agrees to pay the Doctor a base salary of{' '}
                        {contract.doctorFees} L.E per [Month/Year]. <br />
                        b. In addition to the base salary, the Doctor is eligible for a
                        markup rate of {contract.markupRate}% for the clinic to make a profit.
                    </p>

                    <h3>4. Benefits:</h3>
                    <p>The Doctor shall be entitled to the benefits provided by the Clinic to its employees, including health insurance.</p>

                    <h3>5. Termination:</h3>
                    <p>
                        Either party may terminate this agreement with written notice of 2
                        months for any reason. Termination for cause may occur immediately,
                        subject to applicable laws.
                    </p>

                    <h3>6. Confidentiality and Non-Compete:</h3>
                    <p>
                        The Doctor agrees to maintain patient confidentiality and not to
                        engage in any competing practice within 50 miles of the Clinic
                        during the employment term and 12 months after termination.
                    </p>

                    <h3>7. Governing Law:</h3>
                    <p>This Agreement shall be governed by and construed in accordance with the laws of Cairo.</p><br/>

                    <p style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                        Employment Date: {contract.employmentDate} <br /></p>
                    <p style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>Renewal Date: {contract.terminationDate} <br /></p>
                    <p style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>Contract's Status: {contract.status}</p>
                    </div>
                    <div className={styles.ContractButtons}>
                    {(contract.accepted !== true || contract.status === 'Pending') && (
                        <button className={styles.Contractbutton} onClick={handleAcceptContract}>Accept Contract</button>
                    )}

                    {(contract.accepted === true || contract.status === 'Pending') && (
                        <button className={`${styles.Contractbutton} ${styles.RejectButton}`} onClick={handleRejectContract}>Reject Contract</button>
                    )}
                </div>
                </div>
            ))}
        </div>
    );
};

export default ContractView;