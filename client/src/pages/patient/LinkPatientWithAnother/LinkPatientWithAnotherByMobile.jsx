import React, { useState, useEffect } from 'react';
import axios from 'axios';

const LinkPatientWithAnotherByMobile = () => {


    const [mobile, setMobile] = useState('');
    const [relation, setRelation] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);

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
            const response = await fetch('http://localhost:5000/patient/linkByMobile/linkByMobile?username=NayeraMahran', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
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

            } else if (response.status === 404) {
                //setMessage('Patient does not exist.');

                setError('Patient To Be Linked does not exist.');
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
        <div>
            <h1>Link Patient To Be A Family Member</h1>
            <h2>By Phone Number</h2>

            <form onSubmit={handleSubmit}>


                <input
                    type="text"
                    placeholder="Phone Number"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                />

                <select
                    value={relation}
                    onChange={(e) => setRelation(e.target.value)}
                >
                    <option value="">Relation</option>
                    <option value="wife">Wife</option>
                    <option value="husband">Husband</option>
                    <option value="children">Children</option>
                </select>

                <button type="submit">Link</button>
            </form>
            {message && <p>{message}</p>}


            {error && (
                <div style={{ color: 'red' }}>{error}</div>
            )}
        </div>
    );
};

export default LinkPatientWithAnotherByMobile;
