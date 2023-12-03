import React from 'react';

// Styles
import styles from './chatTab.module.css';

// Hooks
import { useState, useEffect } from 'react';

// Font Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faUserDoctor, faUserNurse } from '@fortawesome/free-solid-svg-icons';

export const ChatTab = ({ username, type, onClick }) => {
    const [userUsername, setUserUsername] = useState(username);
    const [userType, setUserType] = useState(type);

    console.log(`ChatTab: ${username}`);

    if (userType === 'doctor') {
        return (
            <div className={styles['chat__sidebar']} onClick={() => onClick(username, type)}>
                <div className={styles['chat__tab']}>
                    <FontAwesomeIcon icon={faUserDoctor} className={styles['chat__icon']} />
                    <p className={styles['chat_name']}>Doctor: {userUsername}</p>
                </div>
            </div>
        );
    }
    else if (userType === 'patient') {
        return (
            <div className={styles['chat__sidebar']} onClick={() => onClick(username, type)}>
                <div className={styles['chat__tab']}>
                    <FontAwesomeIcon icon={faUser} className={styles['chat__icon']} />
                    <p className={styles['chat_name']}>Patient: {userUsername}</p>
                </div>
            </div>
        );

    }
    else if (userType === 'pharmacist') {
        return (
            <div className={styles['chat__sidebar']} onClick={() => onClick(username, type)}>
                <div className={styles['chat__tab']}>
                    <FontAwesomeIcon icon={faUserNurse} className={styles['chat__icon']} />
                    <p className={styles['chat_name']}>Pharmacist: {userUsername}</p>
                </div>
            </div>
        );
    }
    else {
        return (
            <></>
        );
    }

}
