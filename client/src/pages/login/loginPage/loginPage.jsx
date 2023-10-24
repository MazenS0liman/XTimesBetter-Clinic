import React from 'react';

// Axios
import axios from 'axios';

// Hooks
import { useState } from 'react';
import { useAuthUpdate, useUsername } from '../../../components/hooks/useAuth';

// Styles
import styles from './loginPage.module.css';

// React Router
import { useNavigate } from 'react-router-dom';


export const LoginPage = () => {
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [accessToken, setAccessToken] = useState("");
    const [refreshToken, setRefreshToken] = useState("");
    const [error, setError] = useState(false);
    const {updateAccessToken, updateRefreshToken} = useAuthUpdate();
    const {username, setUsername} = useUsername();
    const navigate = useNavigate();

    function handleUsernameChange(event) {
        setName(event.target.value);
    }

    function handlePasswordChange(event) {
        setPassword(event.target.value);
    }

    async function handleLogInClick() {
        const response = await axios({
            method: 'POST',
            url: 'http://localhost:5000/login',
            headers: {
                "Content-Type": "application/json",
            },
            data: {
                username: name,
                password: password
            }
        });

        setAccessToken(response.data.accessToken);
        setRefreshToken(response.data.refreshToken);
        updateAccessToken(response.data.accessToken);
        setUsername(name);
        
        if (response.data.accessToken === undefined || response.data.refreshToken === undefined) {
            setError(true);
        }
        else if (response.data.userType === "patient") {
            navigate('/patient');
        } 
        else if (response.data.userType === "doctor") {
            navigate('/doctor');
        }
        else if (response.data.userType === "admin") {
            navigate('/admin');
        }
    }

    return (
        <div>
            <h3>Login Here</h3>

            <div>
                <label>Username</label>
                <div className={styles['username-input-div']}>
                    <input className={styles['searchbar-input']} value={name} placeholder="Enter username ..." type="text" onChange={handleUsernameChange}/>
                </div>
            </div>

            <div>
                <label>Password</label>
                <div className={styles['password-input-div']}>
                    <input className={styles['searchbar-input']} value={password} placeholder="Enter password ..." type="text" onChange={handlePasswordChange}/>
                </div>
            </div>

            <button onClick={handleLogInClick}>Log In</button>
            {
                error ? <div>Invalid username or password</div> : null
            }
        </div>
    )
}
