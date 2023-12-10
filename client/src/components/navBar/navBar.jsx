// Styles
import classNames from 'classnames';
import styles from './navBar.module.css';

// Components
import { NavLink, Link } from 'react-router-dom';

// Hooks
import { useState } from 'react';
import { useAuthUpdate, useUsername, useUserType } from '../hooks/useAuth';

import ChatIcon from '@mui/icons-material/Chat';

export const Navbar = ({ className, name, list }) => { 
    const {updateAccessToken, updateRefreshToken} = useAuthUpdate();
    const {setUsername} = useUsername();
    const {setUserType} = useUserType();

    function handleClick() {
        // clear access token and refresh token and username stored in the frontend
        updateAccessToken("Bearer  "); // fix that you need to add 2 spaces
        updateRefreshToken("");
        setUsername("");
        setUserType("");
        
        // clear access token and refresh token and username stored in the browser
        sessionStorage.setItem("accessToken", "Bearer  ");
        sessionStorage.setItem("refreshToken", "");
        sessionStorage.setItem("username", "");
        sessionStorage.setItem("userType", "");
    }

    return (
        <div className={classNames(styles.root, className, styles.navbar)}>
            <div className={styles['navbar-logo']}>
                <Link to="/" onClick={handleClick}>Hello, {name}</Link>
            </div>
            <ul className={styles['navbar-list']}>
                {
                    list.map((item, index) => {
                        return(<li key={index} className={styles['navbar-list']}><Link to={item.url}>{item.pageName}</Link></li>);
                    })
                }
            </ul>
        </div>
    );
};