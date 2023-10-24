// Styles
import classNames from 'classnames';
import styles from './navBar.module.css';

// Components
import { NavLink, Link } from 'react-router-dom';

// Hooks
import { useState } from 'react';
import { useAuthUpdate } from '../hooks/useAuth';

export const Navbar = ({ className, name, list }) => { 
    const {updateAccessToken, updateRefreshToken} = useAuthUpdate();

    function handleClick() {
        updateAccessToken("Bearer  "); // fix that you need to add 2 spaces
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