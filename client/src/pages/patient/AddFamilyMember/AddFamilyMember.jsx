import React, { useState, useEffect } from 'react';
import styles from './AddFamilyMember.module.css';
// Axios
import axios from 'axios';
import { useLocation } from 'react-router-dom';
// User Defined Hooks
import { useAuth } from '../../../components/hooks/useAuth';

// React Router DOM
import { useNavigate } from 'react-router-dom';

const AddFamilyMember = () => {

    const accessToken = sessionStorage.getItem('accessToken');
    const [name, setName] = useState('');
    const [national_id, setnational_id] = useState('');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('');
    const [relation, setRelation] = useState('');
    const [patient_username, setpatient_username] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

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

    if (location.pathname == '/add-family-member') {
        return null; // Don't render the component
    }


    const handleSubmit = async (event) => {
        event.preventDefault();
        setMessage('');
        setError('');

        if (!name || !national_id || !age || !gender || !relation) {
            setError('Please fill in all of the required fields.');

            return;
        }

        const familyMember = {
            name,
            national_id,
            age,
            gender,
            relation,

        };
        try {
            const response = await fetch('http://localhost:5000/patient/addFamilyMember', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': accessToken,
                },
                body: JSON.stringify(familyMember),

            });

            console.log(response);

            if (response.status === 201) {

                setIsSubmitted(true);
                setMessage('Family member successfully added!');
                setName('');
                setnational_id('');
                setAge('');
                setGender('');
                setRelation('');
                // setpatient_username('');
                window.location.reload();
                const data = await response.json();
                if (data.length === 0) {
                    setMessage('No Patient found with this username');
                }
                //window.location.href = '/success';
            } else if (response.status === 404) {
                //setMessage('Patient does not exist.');

                setError('Patient does not exist.');
            }
            else {

                setError('An error occurred while adding the family member.');
            }
        } catch (error) {
            console.log("There is an error");
            setError(error.message);
        }
    };
    return (
        <>

            <form onSubmit={handleSubmit}>
                <div className={styles.ADDform}>
                    <div>
                        <label htmlFor="name" className={styles.ADDlabel}>Name:</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            autoComplete="off"
                            className={styles.ADDinput}
                        />
                    </div>

                    <div>
                        <label htmlFor="national_id" className={styles.ADDlabel}>National ID:</label>
                        <input
                            type="text"
                            id="national_id"
                            value={national_id}
                            onChange={(e) => setnational_id(e.target.value)}
                            autoComplete="off"
                            className={styles.ADDinput}
                        />
                    </div>

                    <div>
                        <label htmlFor="age" className={styles.ADDlabel}>Age:</label>
                        <input
                            type="number"
                            id="age"
                            value={age}
                            onChange={(e) => setAge(e.target.value)}
                            autoComplete="off"
                            className={styles.ADDinput}
                        />
                    </div>

                    <div>
                        <label htmlFor="gender" className={styles.ADDlabel}>Gender:</label>
                        <select
                            id="gender"
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                            className={styles.ADDselect}
                        >
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="relation" className={styles.ADDlabel}>Relation:</label>
                        <select
                            id="relation"
                            value={relation}
                            onChange={(e) => setRelation(e.target.value)}
                            className={styles.ADDselect}
                        >
                            <option value="">Select Relation</option>
                            <option value="wife">Wife</option>
                            <option value="husband">Husband</option>
                            <option value="children">Children</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        className={styles['ADDbutton']}
                    >
                        Submit
                    </button>
                </div>
            </form>

            {message && <p>{message}</p>}

            {error && (
                <div style={{ color: 'red' }}>{error}</div>
            )}
        </>
    );

};

export default AddFamilyMember;
/*import React, { useState, useEffect } from 'react';

import axios from 'axios';

const AddFamilyMember = () => {

    const [name, setName] = useState('');
    const [national_id, setnational_id] = useState('');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('');
    const [relation, setRelation] = useState('');
    const [patient_username, setpatient_username] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async () => {
        setMessage('');
        setError('');

        if (!name || !national_id || !age || !gender || !relation || !patient_username) {
            setError('Please fill in all of the required fields.');
            return;
        }
        const patient = await patientModel.find({ username: patient_username });
        if (patient.length === 0) {

            setError('PATIENT NOT FOUND');
            return;

        }


        const familyMember = {
            name,
            national_id,
            age,
            gender,
            relation,
            patient_username,
        };
        try {
            const response = await fetch('http://localhost:5000/patient/addFamilyMember', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(familyMember),
            });

            if (response.status === 201) {
                const data = await response.json();
                if (data.length === 0) {
                    setError('No Patient found with this username');
                }
                window.location.href = '/success';
            } else if (response.status === 404) {
                setError('No Patient found with this username');
            }
            else {
                setError('An error occurred while adding the family member.');
            }
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div>
            <h1>Add Family Member</h1>

            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                <input
                    type="text"
                    placeholder="National ID"
                    value={national_id}
                    onChange={(e) => setnational_id(e.target.value)}
                />

                <input
                    type="number"
                    placeholder="Age"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                />



                <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    class="dropdown-button"
                >
                    <option value="">Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                </select>



                <select
                    value={relation}
                    onChange={(e) => setRelation(e.target.value)}
                >
                    <option value="">Relation</option>
                    <option value="wife">Wife</option>
                    <option value="husband">Husband</option>
                    <option value="children">Children</option>
                </select>

                <input
                    type="text"
                    placeholder="Patient Username"
                    value={patient_username}
                    onChange={(e) => setpatient_username(e.target.value)}
                />

                <button type="submit">Submit</button>
            </form>

            {error && (
                <div style={{ color: 'red' }}>{error}</div>
            )}
        </div>
    );
};

export default AddFamilyMember;*/

/*import React, { useState, useEffect } from 'react';

import axios from 'axios';

const AddFamilyMember = () => {

    const [name, setName] = useState('');
    const [national_id, setnational_id] = useState('');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('');
    const [relation, setRelation] = useState('');
    const [patient_username, setpatient_username] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');


    const handleSubmit = async () => {
        setMessage('');
        setError('');

        if (!name || !national_id || !age || !gender || !relation || !patient_username) {
            setError('Please fill in all of the required fields.');
            return;
        }
        const patient = await patientModel.find({ username: patient_username });
        if (patient.lenght === 0) {

            setError('PATIENT NOT FOUND');
            return;

        }


        const familyMember = {
            name,
            national_id,
            age,
            gender,
            relation,
            patient_username,
        };
        try {
            const response = await fetch('http://localhost:5000/patient/addFamilyMember', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(familyMember),
            });

            if (response.status === 201) {
                const data = await response.json();
                if (data.length === 0) {
                    setError('No Patient found with this username');
                }
                window.location.href = '/success';
            } else if (response.status === 404) {
                setError('No Patient found with this username');
            }
            else {
                setError('An error occurred while adding the family member.');
            }
        } catch (error) {
            setError(error.message);
        }
    };
    return (
        <div>
            <h1>Add Family Member</h1>

            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                <input
                    type="text"
                    placeholder="National ID"
                    value={national_id}
                    onChange={(e) => setnational_id(e.target.value)}
                />

                <input
                    type="number"
                    placeholder="Age"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                />



                <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    class="dropdown-button"
                >
                    <option value="">Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                </select>



                <select
                    value={relation}
                    onChange={(e) => setRelation(e.target.value)}
                >
                    <option value="" >Relation</option>
                    <option value="wife">Wife</option>
                    <option value="husband">Husband</option>
                    <option value="children">Children</option>
                </select>

                <input
                    type="text"
                    placeholder="Patient Username"
                    value={patient_username}
                    onChange={(e) => setpatient_username(e.target.value)}
                />

                <button type="submit">Submit</button>
            </form>



            {error && (
                <div style={{ color: 'red' }}>{error}</div>
            )}
        </div>
    );
};

export default AddFamilyMember;*/