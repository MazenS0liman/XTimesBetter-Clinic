import React, { useEffect } from 'react'

// Styles
import styles from './showCard.module.css';

// Hooks
import { useState } from 'react';

// MUI Components
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import WalletIcon from '@mui/icons-material/Wallet';
import MedicationIcon from '@mui/icons-material/Medication';
import EditIcon from '@mui/icons-material/Edit';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';

// Font Awesome icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faKey, faWallet, faEye, faDeaf } from '@fortawesome/free-solid-svg-icons';

// Components
import { Modal } from '../modalCard/modalCard';

import { animateScroll as scroll } from 'react-scroll';

export const ShowCard = ({ title, icon, open, setOpen, navigate, children }) => {
    return (
        <div className={styles['main__div']} onClick={() => {
                console.log(`Open: ${open}`);
                if (open !== undefined) {
                    if (!open) {
                        scroll.scrollToTop()
                    }
                    setOpen(!open);
                }

                console.log(`Navigate: ${navigate}`);
                if (navigate !== undefined) {
                    navigate();
                }
            }} style={{cursor: 'pointer'}}>
            <div className={styles['left__div']}>
                {
                    icon
                }
            </div>
            <div className={styles['middle__div']}>
                <label className={styles['dropdown__label']} style={{zIndex: -1}}>{ title }</label>
            </div>
            <div className={styles['right__div']} >
                {children}
            </div>
        </div>
    )
}

