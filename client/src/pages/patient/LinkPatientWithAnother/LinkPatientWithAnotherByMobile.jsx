import React, { useState, useEffect } from 'react';
import styles from './LinkPatient.module.css';
// Axios
import axios from 'axios';

// User Defined Hooks
import { useAuth } from '../../../components/hooks/useAuth';

// React Router DOM
import { useNavigate } from 'react-router-dom';

const LinkPatientWithAnotherByMobile = () => {
    // const {accessToken} = useAuth();
    const accessToken = sessionStorage.getItem('accessToken');
    const [mobile, setMobile] = useState('');
    const [relation, setRelation] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const navigate = useNavigate();

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

    const handleSubmit = async (event) => {
        event.preventDefault();
        setMessage('');
        setError('');

        if (!mobile || !relation) {
            setError('Please fill in all of the required fields.');

            return;
        }

        const LinkedfamilyMember = {
            mobile,
            relation,
        };
        try {
            const response = await fetch('http://localhost:5000/patient/linkByMobile/linkByMobile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': accessToken,
                },
                body: JSON.stringify(LinkedfamilyMember),

            });

            console.log(response);

            if (response.status === 201) {

                setIsSubmitted(true);
                setMessage('Family member successfully Linked!');
                setMobile('');
                setRelation('');

                const data = await response.json();
                window.location.reload();
            } else if (response.status === 404) {
                //setMessage('Patient does not exist.');

                setError('Patient To Be Linked does not exist.');
            }
            else if (response.status === 400) {
                //setMessage('Patient does not exist.');

                setError('Patient is already Linked.');
            }
            else {

                setError('An error occurred while linking the family member.');
            }
        } catch (error) {
            console.log("There is an error");
            setError(error.message);
        }
    };
    return (
        <div className={styles['Linkdiv-schedule']}>
            <h1>Link By Phone Number</h1>

            <form className={styles['Linkform']} onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="mobile" className={styles['Linklabel']}>Phone Number:</label>
                    <input
                        type="text"
                        id="mobile"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        autoComplete="off"
                        className={styles['Linkinput']}
                    />
                </div>

                <div>
                    <label htmlFor="relation" className={styles['Linklabel']}>Relation:</label>
                    <select
                        id="relation"
                        value={relation}
                        onChange={(e) => setRelation(e.target.value)}
                        className={styles['Linkselect']}
                    >
                        <option value="">Relation</option>
                        <option value="wife">Wife</option>
                        <option value="husband">Husband</option>
                        <option value="children">Children</option>
                    </select>
                </div>

                <button type="submit" className={styles['Linkbutton']}>Link</button>
            </form>

            {message && <p>{message}</p>}
            {error && <div style={{ color: 'red' }}>{error}</div>}
        </div>
    );
};

export default LinkPatientWithAnotherByMobile;
