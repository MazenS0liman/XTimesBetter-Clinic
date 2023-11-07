import * as React from 'react';

// Axios
import axios from 'axios';

// Styles
import styles from './changePasswordCard.module.css';

// Hooks
import { useState } from 'react';

// React Router DOM
import { useNavigate } from 'react-router-dom';

// Home Made Hooks
import { useUsername, useUserType } from '../hooks/useAuth';

// Home Made Components
import { AlertMessageCard } from '../alertMessageCard/alertMessageCard';

export const PasswordCard = () => {
    const [currentPassword, setCurrentPassword] =useState('');
    const [newPassword, setNewPassword] = useState('');
    const {username, setUsername} = useUsername();
    const {userType, setUserType} = useUserType();
    const [showAlertMessage, setShowAlertMessage] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const navigate = useNavigate();

    async function handleClickChangePassword() {
        await axios ({
            method: 'put',
            url: `http://localhost:5000/${userType}/changePassword?username=${username}`,
            headers: {
                "Content-Type": "application/json",
            },
            params: {currentPassword: currentPassword, newPassword: newPassword},
        })
        .then((response) => {
            setAlertMessage('Password changed successfully');
            setShowAlertMessage(true);
        })
        .catch((error) => {
            console.log(`Error ${error}`);
            setAlertMessage('Incorrect current password or current password is same as new password');
            setShowAlertMessage(true);
        });
    }

    function handleChangeCurrentPassword(event) {
        setCurrentPassword(event.target.value);
    }

    function handleChangeNewPassword(event) {
        setNewPassword(event.target.value);
    }

    return (
        <>
        <div className={styles['change-password-main-div']}>
            <div className={styles['change-password-sub1-div']}>
                <div className={styles['change-password-sub1-subtitle-div']}>
                    <label className={styles['subtitle']}>Enter Current Password</label>
                </div>
                <input className={styles['password-input']} value={currentPassword} placeholder="Enter Current Password" type="password" onChange={handleChangeCurrentPassword}/>
            </div>
            <div className={styles['change-password-sub2-div']}>
                <div className={styles['change-password-sub2-subtitle-div']}>
                    <label className={styles['subtitle']}>Enter New Password</label>
                </div>
                <input className={styles['password-input']} value={newPassword} placeholder="Enter New Password" type="password" onChange={handleChangeNewPassword}/>
            </div>
            <div className={styles['change-password-sub3-div']}>
                <button className={styles['change-password-button']} onClick={handleClickChangePassword}>Change Password</button>
            </div>
        </div>
        {showAlertMessage && (<AlertMessageCard message={alertMessage} showAlertMessage={setShowAlertMessage} ></AlertMessageCard>)}
        </>
    );
}